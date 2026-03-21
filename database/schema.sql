-- Database Schema for AI-Driven Community Safety System
-- Supports both historical analysis and real-time agent processing

-- ============================================================================
-- INCIDENTS TABLE
-- ============================================================================
-- Stores all community incidents with full historical context
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core incident information
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    
    -- Location data (for geospatial queries)
    location_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    location_id VARCHAR(50), -- Reference to predefined locations
    
    -- Temporal data (for time-series analysis)
    incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
    incident_time TIME,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Status and priority
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    severity VARCHAR(20), -- low, medium, high, critical
    
    -- Reporter information
    reporter_name VARCHAR(255),
    reporter_email VARCHAR(255),
    reporter_phone VARCHAR(20),
    is_anonymous BOOLEAN DEFAULT false,
    
    -- AI Analysis data (JSONB for flexible structure)
    ai_analysis JSONB,
    ai_category VARCHAR(100), -- AI-suggested category
    ai_confidence DECIMAL(5, 4), -- 0.0000 to 1.0000
    ai_tags TEXT[], -- Array of AI-generated tags
    ai_entities JSONB, -- Named entities extracted (people, places, etc.)
    ai_summary TEXT, -- AI-generated summary
    
    -- Metadata for analysis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1, -- For tracking updates
    
    -- Indexes for performance
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'reviewing', 'in_progress', 'resolved', 'closed', 'escalated'))
);

-- Indexes for fast queries
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_priority ON incidents(priority);
CREATE INDEX idx_incidents_category ON incidents(category);
CREATE INDEX idx_incidents_incident_date ON incidents(incident_date);
CREATE INDEX idx_incidents_reported_at ON incidents(reported_at);
CREATE INDEX idx_incidents_location_id ON incidents(location_id);
CREATE INDEX idx_incidents_ai_confidence ON incidents(ai_confidence DESC);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);

-- Geospatial index (if using PostGIS)
-- CREATE INDEX idx_incidents_location ON incidents USING GIST (ST_Point(longitude, latitude));

-- Full-text search index
CREATE INDEX idx_incidents_description_search ON incidents USING GIN (to_tsvector('english', description));
CREATE INDEX idx_incidents_title_search ON incidents USING GIN (to_tsvector('english', title));

-- JSONB index for AI analysis queries
CREATE INDEX idx_incidents_ai_analysis ON incidents USING GIN (ai_analysis);

-- ============================================================================
-- PATROL ROUTES TABLE
-- ============================================================================
-- Defines patrol routes and their schedules
CREATE TABLE patrol_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Route identification
    route_name VARCHAR(255) NOT NULL,
    route_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Route definition (stored as GeoJSON or array of coordinates)
    waypoints JSONB NOT NULL, -- Array of {lat, lng, order, name}
    route_path JSONB, -- Full path geometry (GeoJSON LineString)
    total_distance_km DECIMAL(10, 2),
    estimated_duration_minutes INTEGER,
    
    -- Schedule information
    schedule_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'custom'
    schedule_config JSONB, -- Flexible schedule configuration
    active_days_of_week INTEGER[], -- [0=Sunday, 1=Monday, ..., 6=Saturday]
    start_time TIME,
    end_time TIME,
    timezone VARCHAR(50) DEFAULT 'America/Port_of_Spain',
    
    -- Route metadata
    priority_level INTEGER DEFAULT 5, -- 1-10, higher = more important
    is_active BOOLEAN DEFAULT true,
    assigned_agent_id UUID, -- Reference to agents/users
    assigned_team VARCHAR(100),
    
    -- Coverage and effectiveness metrics
    coverage_area_km2 DECIMAL(10, 2),
    incidents_in_route_count INTEGER DEFAULT 0,
    last_patrolled_at TIMESTAMP WITH TIME ZONE,
    average_patrol_duration_minutes INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_schedule_type CHECK (schedule_type IN ('daily', 'weekly', 'custom', 'on_demand'))
);

-- Indexes for patrol routes
CREATE INDEX idx_patrol_routes_active ON patrol_routes(is_active) WHERE is_active = true;
CREATE INDEX idx_patrol_routes_priority ON patrol_routes(priority_level DESC);
CREATE INDEX idx_patrol_routes_assigned_agent ON patrol_routes(assigned_agent_id);
CREATE INDEX idx_patrol_routes_waypoints ON patrol_routes USING GIN (waypoints);

-- ============================================================================
-- PATROL EXECUTIONS TABLE
-- ============================================================================
-- Historical record of actual patrols executed
CREATE TABLE patrol_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES patrol_routes(id) ON DELETE CASCADE,
    
    -- Execution details
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    actual_duration_minutes INTEGER,
    agent_id UUID NOT NULL,
    
    -- Actual path taken (may differ from planned route)
    actual_path JSONB, -- GeoJSON LineString of actual GPS track
    checkpoints JSONB, -- Array of checkpoints with timestamps
    
    -- Observations and findings
    incidents_observed INTEGER DEFAULT 0,
    incidents_reported INTEGER DEFAULT 0,
    observations TEXT,
    weather_conditions VARCHAR(50),
    visibility_conditions VARCHAR(50),
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
    completion_percentage DECIMAL(5, 2), -- 0.00 to 100.00
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_execution_status CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'interrupted'))
);

-- Indexes for patrol executions
CREATE INDEX idx_patrol_executions_route ON patrol_executions(route_id);
CREATE INDEX idx_patrol_executions_agent ON patrol_executions(agent_id);
CREATE INDEX idx_patrol_executions_started_at ON patrol_executions(started_at DESC);
CREATE INDEX idx_patrol_executions_status ON patrol_executions(status);

-- ============================================================================
-- AGENT DECISIONS TABLE
-- ============================================================================
-- Logs all AI agent decisions for analysis and learning
CREATE TABLE agent_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Decision context
    decision_type VARCHAR(100) NOT NULL, -- 'route_optimization', 'incident_prioritization', 'resource_allocation', etc.
    context_id UUID, -- ID of related entity (incident_id, route_id, etc.)
    context_type VARCHAR(50), -- 'incident', 'route', 'patrol', etc.
    
    -- Decision input (what the agent considered)
    input_data JSONB NOT NULL, -- All inputs that influenced the decision
    input_features JSONB, -- Extracted features used in decision
    
    -- Decision output
    decision JSONB NOT NULL, -- The actual decision made
    action_taken VARCHAR(255),
    action_result_id UUID, -- Reference to resulting action/outcome
    
    -- AI model information
    model_name VARCHAR(100), -- e.g., 'gpt-4', 'gpt-3.5-turbo', 'custom-model-v1'
    model_version VARCHAR(50),
    prompt_template_id VARCHAR(100),
    
    -- Confidence and reasoning
    confidence_score DECIMAL(5, 4), -- 0.0000 to 1.0000
    reasoning TEXT, -- Human-readable explanation
    alternative_options JSONB, -- Other options considered with scores
    
    -- Performance metrics
    processing_time_ms INTEGER,
    tokens_used INTEGER,
    cost_usd DECIMAL(10, 6),
    
    -- Validation and feedback
    was_correct BOOLEAN, -- If decision was validated by human/expert
    human_feedback TEXT,
    feedback_source VARCHAR(50), -- 'expert', 'agent', 'system', 'user'
    feedback_timestamp TIMESTAMP WITH TIME ZONE,
    
    -- Learning data
    training_example BOOLEAN DEFAULT false, -- Whether to use for model training
    outcome_observed BOOLEAN DEFAULT false,
    outcome_value JSONB, -- Actual outcome if observed
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

-- Indexes for agent decisions
CREATE INDEX idx_agent_decisions_type ON agent_decisions(decision_type);
CREATE INDEX idx_agent_decisions_context ON agent_decisions(context_type, context_id);
CREATE INDEX idx_agent_decisions_confidence ON agent_decisions(confidence_score DESC);
CREATE INDEX idx_agent_decisions_created_at ON agent_decisions(created_at DESC);
CREATE INDEX idx_agent_decisions_model ON agent_decisions(model_name, model_version);
CREATE INDEX idx_agent_decisions_training ON agent_decisions(training_example) WHERE training_example = true;
CREATE INDEX idx_agent_decisions_feedback ON agent_decisions(was_correct) WHERE was_correct IS NOT NULL;
CREATE INDEX idx_agent_decisions_input ON agent_decisions USING GIN (input_data);
CREATE INDEX idx_agent_decisions_decision ON agent_decisions USING GIN (decision);

-- ============================================================================
-- INCIDENT-ROUTE ASSOCIATIONS
-- ============================================================================
-- Links incidents to patrol routes (many-to-many)
CREATE TABLE incident_route_associations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES patrol_routes(id) ON DELETE CASCADE,
    
    -- Association metadata
    association_type VARCHAR(50), -- 'within_route', 'nearby', 'historical_pattern'
    distance_meters DECIMAL(10, 2), -- Distance from route
    discovered_during_patrol BOOLEAN DEFAULT false,
    patrol_execution_id UUID REFERENCES patrol_executions(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(incident_id, route_id)
);

CREATE INDEX idx_incident_route_incident ON incident_route_associations(incident_id);
CREATE INDEX idx_incident_route_route ON incident_route_associations(route_id);

-- ============================================================================
-- DECISION-INCIDENT LINKS
-- ============================================================================
-- Links agent decisions to specific incidents
CREATE TABLE decision_incident_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES agent_decisions(id) ON DELETE CASCADE,
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    
    link_type VARCHAR(50), -- 'prioritized', 'categorized', 'routed', 'escalated'
    impact_score DECIMAL(5, 4), -- How much the decision impacted the incident
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(decision_id, incident_id)
);

CREATE INDEX idx_decision_incident_decision ON decision_incident_links(decision_id);
CREATE INDEX idx_decision_incident_incident ON decision_incident_links(incident_id);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_incidents_updated_at
    BEFORE UPDATE ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patrol_routes_updated_at
    BEFORE UPDATE ON patrol_routes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patrol_executions_updated_at
    BEFORE UPDATE ON patrol_executions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Recent high-priority incidents
CREATE VIEW recent_high_priority_incidents AS
SELECT 
    i.*,
    COUNT(d.id) as decision_count,
    AVG(d.confidence_score) as avg_decision_confidence
FROM incidents i
LEFT JOIN decision_incident_links dil ON i.id = dil.incident_id
LEFT JOIN agent_decisions d ON dil.decision_id = d.id
WHERE i.priority IN ('high', 'critical')
    AND i.incident_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY i.id
ORDER BY i.incident_date DESC;

-- View: Route effectiveness metrics
CREATE VIEW route_effectiveness AS
SELECT 
    pr.id,
    pr.route_name,
    pr.route_code,
    COUNT(DISTINCT pe.id) as total_patrols,
    COUNT(DISTINCT ira.incident_id) as incidents_found,
    AVG(pe.actual_duration_minutes) as avg_duration_minutes,
    MAX(pe.completed_at) as last_patrol_date,
    AVG(pe.completion_percentage) as avg_completion_rate
FROM patrol_routes pr
LEFT JOIN patrol_executions pe ON pr.id = pe.route_id
LEFT JOIN incident_route_associations ira ON pr.id = ira.route_id
WHERE pr.is_active = true
GROUP BY pr.id, pr.route_name, pr.route_code
ORDER BY incidents_found DESC;

-- View: Agent decision performance
CREATE VIEW agent_decision_performance AS
SELECT 
    decision_type,
    model_name,
    COUNT(*) as total_decisions,
    AVG(confidence_score) as avg_confidence,
    AVG(processing_time_ms) as avg_processing_time_ms,
    SUM(cost_usd) as total_cost_usd,
    COUNT(CASE WHEN was_correct = true THEN 1 END) as correct_decisions,
    COUNT(CASE WHEN was_correct = false THEN 1 END) as incorrect_decisions,
    COUNT(CASE WHEN was_correct IS NOT NULL THEN 1 END) as validated_decisions
FROM agent_decisions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY decision_type, model_name
ORDER BY total_decisions DESC;



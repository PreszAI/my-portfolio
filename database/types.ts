// TypeScript types for database schema
// Generated for AI-Driven Community Safety System

export type IncidentStatus = 'pending' | 'reviewing' | 'in_progress' | 'resolved' | 'closed' | 'escalated'
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical'
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface Incident {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string | null
  
  // Location
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  address?: string | null
  location_id?: string | null
  
  // Temporal
  incident_date: Date
  incident_time?: string | null
  reported_at: Date
  resolved_at?: Date | null
  
  // Status
  status: IncidentStatus
  priority: IncidentPriority
  severity?: IncidentSeverity | null
  
  // Reporter
  reporter_name?: string | null
  reporter_email?: string | null
  reporter_phone?: string | null
  is_anonymous: boolean
  
  // AI Analysis
  ai_analysis?: AIAnalysis | null
  ai_category?: string | null
  ai_confidence?: number | null
  ai_tags?: string[] | null
  ai_entities?: NamedEntities | null
  ai_summary?: string | null
  
  // Metadata
  created_at: Date
  updated_at: Date
  version: number
}

export interface AIAnalysis {
  category: string
  severity: string
  summary: string
  entities: NamedEntities
  suggestedActions?: string[]
  tags?: string[]
  confidence?: number
  reasoning?: string
}

export interface NamedEntities {
  people?: string[]
  locations?: string[]
  organizations?: string[]
  dates?: string[]
  times?: string[]
}

export type ScheduleType = 'daily' | 'weekly' | 'custom' | 'on_demand'

export interface PatrolRoute {
  id: string
  route_name: string
  route_code: string
  description?: string | null
  
  // Route definition
  waypoints: Waypoint[]
  route_path?: GeoJSON.LineString | null
  total_distance_km?: number | null
  estimated_duration_minutes?: number | null
  
  // Schedule
  schedule_type: ScheduleType
  schedule_config?: ScheduleConfig | null
  active_days_of_week?: number[] | null
  start_time?: string | null
  end_time?: string | null
  timezone: string
  
  // Metadata
  priority_level: number
  is_active: boolean
  assigned_agent_id?: string | null
  assigned_team?: string | null
  
  // Metrics
  coverage_area_km2?: number | null
  incidents_in_route_count: number
  last_patrolled_at?: Date | null
  average_patrol_duration_minutes?: number | null
  
  created_at: Date
  updated_at: Date
}

export interface Waypoint {
  lat: number
  lng: number
  order: number
  name?: string
  checkpoint_id?: string
}

export interface ScheduleConfig {
  recurrence?: string
  exceptions?: string[]
  timezone?: string
  [key: string]: any
}

export type PatrolExecutionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'interrupted'

export interface PatrolExecution {
  id: string
  route_id: string
  started_at: Date
  completed_at?: Date | null
  actual_duration_minutes?: number | null
  agent_id: string
  
  // Actual path
  actual_path?: GeoJSON.LineString | null
  checkpoints?: Checkpoint[] | null
  
  // Observations
  incidents_observed: number
  incidents_reported: number
  observations?: string | null
  weather_conditions?: string | null
  visibility_conditions?: string | null
  
  // Status
  status: PatrolExecutionStatus
  completion_percentage?: number | null
  
  created_at: Date
  updated_at: Date
}

export interface Checkpoint {
  lat: number
  lng: number
  timestamp: Date
  checkpoint_name?: string
  observations?: string
}

export type DecisionType = 
  | 'route_optimization'
  | 'incident_prioritization'
  | 'resource_allocation'
  | 'incident_categorization'
  | 'risk_assessment'
  | 'patrol_scheduling'
  | 'alert_generation'

export type ContextType = 'incident' | 'route' | 'patrol' | 'agent' | 'system'

export interface AgentDecision {
  id: string
  
  // Context
  decision_type: DecisionType
  context_id?: string | null
  context_type?: ContextType | null
  
  // Input
  input_data: Record<string, any>
  input_features?: Record<string, any> | null
  
  // Output
  decision: Record<string, any>
  action_taken?: string | null
  action_result_id?: string | null
  
  // Model info
  model_name?: string | null
  model_version?: string | null
  prompt_template_id?: string | null
  
  // Confidence
  confidence_score?: number | null
  reasoning?: string | null
  alternative_options?: DecisionOption[] | null
  
  // Performance
  processing_time_ms?: number | null
  tokens_used?: number | null
  cost_usd?: number | null
  
  // Validation
  was_correct?: boolean | null
  human_feedback?: string | null
  feedback_source?: string | null
  feedback_timestamp?: Date | null
  
  // Learning
  training_example: boolean
  outcome_observed: boolean
  outcome_value?: Record<string, any> | null
  
  created_at: Date
}

export interface DecisionOption {
  option: string
  score: number
  reasoning?: string
}

export interface IncidentRouteAssociation {
  id: string
  incident_id: string
  route_id: string
  association_type?: string | null
  distance_meters?: number | null
  discovered_during_patrol: boolean
  patrol_execution_id?: string | null
  created_at: Date
}

export interface DecisionIncidentLink {
  id: string
  decision_id: string
  incident_id: string
  link_type?: string | null
  impact_score?: number | null
  created_at: Date
}

// View types
export interface RecentHighPriorityIncident extends Incident {
  decision_count: number
  avg_decision_confidence: number | null
}

export interface RouteEffectiveness {
  id: string
  route_name: string
  route_code: string
  total_patrols: number
  incidents_found: number
  avg_duration_minutes: number | null
  last_patrol_date: Date | null
  avg_completion_rate: number | null
}

export interface AgentDecisionPerformance {
  decision_type: string
  model_name: string | null
  total_decisions: number
  avg_confidence: number | null
  avg_processing_time_ms: number | null
  total_cost_usd: number | null
  correct_decisions: number
  incorrect_decisions: number
  validated_decisions: number
}

// Query types for real-time processing
export interface IncidentQuery {
  status?: IncidentStatus[]
  priority?: IncidentPriority[]
  category?: string[]
  location_id?: string
  date_from?: Date
  date_to?: Date
  has_ai_analysis?: boolean
  min_confidence?: number
  limit?: number
  offset?: number
}

export interface RouteQuery {
  is_active?: boolean
  assigned_agent_id?: string
  priority_level_min?: number
  has_recent_patrols?: boolean
  limit?: number
}

export interface DecisionQuery {
  decision_type?: DecisionType[]
  context_type?: ContextType
  context_id?: string
  model_name?: string
  min_confidence?: number
  date_from?: Date
  date_to?: Date
  has_feedback?: boolean
  limit?: number
}



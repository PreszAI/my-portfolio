# Database Schema for AI-Driven Community Safety System

This database schema is designed to support both **historical analysis** and **real-time AI agent processing** for a community safety application.

## Overview

The schema consists of three main entity groups:

1. **Incidents** - Community safety incidents with AI analysis
2. **Patrol Routes** - Defined patrol routes and execution history
3. **Agent Decisions** - AI agent decision logs for learning and analysis

## Key Design Principles

### 1. Historical Analysis Support
- **Time-series indexes** on date/timestamp columns for trend analysis
- **JSONB columns** for flexible, queryable structured data
- **Version tracking** for incident updates
- **Comprehensive metadata** for filtering and grouping

### 2. Real-Time Processing Support
- **Optimized indexes** on frequently queried columns (status, priority, location)
- **Geospatial support** for location-based queries (PostGIS ready)
- **Full-text search** indexes for text-based queries
- **JSONB GIN indexes** for fast JSON queries

### 3. AI/ML Integration
- **Decision logging** with full context for model training
- **Confidence scores** and reasoning for transparency
- **Feedback loops** for continuous learning
- **Performance metrics** (processing time, cost, tokens)

## Schema Files

- `schema.sql` - Complete PostgreSQL schema with indexes, triggers, and views
- `types.ts` - TypeScript type definitions for type-safe database access
- `prisma/schema.prisma` - Prisma ORM schema for database migrations

## Tables

### Core Tables

#### `incidents`
Stores all community incidents with full context and AI analysis.

**Key Features:**
- Location data (lat/lng, address, location_id)
- Temporal data (incident_date, reported_at, resolved_at)
- AI analysis (category, confidence, entities, summary)
- Status tracking (pending → resolved workflow)

**Indexes:**
- Status, priority, category for filtering
- Date indexes for time-series queries
- Full-text search on description/title
- JSONB index on ai_analysis

#### `patrol_routes`
Defines patrol routes with schedules and waypoints.

**Key Features:**
- GeoJSON route paths
- Flexible scheduling (daily, weekly, custom)
- Priority levels for route importance
- Coverage metrics

**Indexes:**
- Active routes (partial index)
- Priority level
- Assigned agent

#### `patrol_executions`
Historical record of actual patrols executed.

**Key Features:**
- Actual GPS path (may differ from planned)
- Checkpoints with timestamps
- Observations and findings
- Completion metrics

#### `agent_decisions`
Comprehensive log of all AI agent decisions.

**Key Features:**
- Full input/output context
- Model information (name, version, prompt)
- Confidence scores and reasoning
- Human feedback for learning
- Performance metrics (time, cost, tokens)

**Indexes:**
- Decision type for filtering
- Context (type + id) for lookups
- Confidence score for quality analysis
- Training examples for model improvement

### Association Tables

#### `incident_route_associations`
Links incidents to patrol routes (many-to-many).

#### `decision_incident_links`
Links agent decisions to specific incidents.

## Views

### `recent_high_priority_incidents`
Aggregates high-priority incidents with decision metrics.

### `route_effectiveness`
Route performance metrics (patrols, incidents found, completion rates).

### `agent_decision_performance`
Agent decision statistics by type and model.

## Usage Examples

### Real-Time Queries

```sql
-- Get pending high-priority incidents for agent processing
SELECT * FROM incidents
WHERE status = 'pending'
  AND priority IN ('high', 'critical')
  AND ai_confidence IS NULL
ORDER BY incident_date DESC
LIMIT 10;

-- Find active routes needing patrol
SELECT * FROM patrol_routes
WHERE is_active = true
  AND (last_patrolled_at IS NULL 
       OR last_patrolled_at < NOW() - INTERVAL '24 hours')
ORDER BY priority_level DESC;
```

### Historical Analysis

```sql
-- Incident trends by category
SELECT 
  category,
  DATE_TRUNC('month', incident_date) as month,
  COUNT(*) as count,
  AVG(ai_confidence) as avg_confidence
FROM incidents
WHERE incident_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY category, month
ORDER BY month DESC, count DESC;

-- Agent decision accuracy over time
SELECT 
  DATE_TRUNC('week', created_at) as week,
  decision_type,
  COUNT(*) as total,
  AVG(confidence_score) as avg_confidence,
  COUNT(CASE WHEN was_correct = true THEN 1 END)::float / 
    COUNT(CASE WHEN was_correct IS NOT NULL THEN 1 END) as accuracy
FROM agent_decisions
WHERE created_at >= CURRENT_DATE - INTERVAL '3 months'
  AND was_correct IS NOT NULL
GROUP BY week, decision_type
ORDER BY week DESC;
```

### AI Training Data

```sql
-- Get validated decisions for training
SELECT 
  input_data,
  decision,
  outcome_value,
  was_correct
FROM agent_decisions
WHERE training_example = true
  AND outcome_observed = true
  AND was_correct IS NOT NULL
ORDER BY created_at DESC;
```

## Migration Guide

### Using Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy
```

### Using Raw SQL

```bash
# Apply schema
psql -d your_database -f database/schema.sql
```

## Performance Considerations

1. **Indexes**: All frequently queried columns are indexed
2. **JSONB**: Use GIN indexes for JSON queries
3. **Partitioning**: Consider partitioning `incidents` by date for very large datasets
4. **Archiving**: Archive old `agent_decisions` to separate table after training
5. **Connection Pooling**: Use connection pooling for real-time queries

## Security

- Use row-level security (RLS) for multi-tenant scenarios
- Encrypt sensitive fields (reporter_email, reporter_phone)
- Audit logs for all agent decisions
- Rate limiting on decision creation

## Future Enhancements

- [ ] PostGIS extension for advanced geospatial queries
- [ ] TimescaleDB for time-series optimization
- [ ] Materialized views for dashboard queries
- [ ] Partitioning for large-scale deployments
- [ ] Read replicas for analytics workloads



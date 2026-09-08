-- JidoSapp Migration 002 — Schema updates and additions
-- Run after 001_initial_schema.sql
-- Adds missing columns, normalises naming, adds new tables

-- ──────────────────────────────────────────────
-- 1. Fix automations table (add status column)
-- ──────────────────────────────────────────────
ALTER TABLE automations
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'inactive',
    ADD COLUMN IF NOT EXISTS trigger_config TEXT,
    ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Backfill name from description if missing
UPDATE automations SET name = description WHERE name IS NULL OR name = '';
UPDATE automations SET status = CASE WHEN is_active = 1 THEN 'active' ELSE 'inactive' END;

-- ──────────────────────────────────────────────
-- 2. Fix automation_nodes — normalise column names
-- ──────────────────────────────────────────────
ALTER TABLE automation_nodes
    ADD COLUMN IF NOT EXISTS node_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS position TEXT DEFAULT '{"x":0,"y":0}';

UPDATE automation_nodes SET node_id = node_key WHERE node_id IS NULL;

-- ──────────────────────────────────────────────
-- 3. Fix automation_edges — normalise column names
-- ──────────────────────────────────────────────
ALTER TABLE automation_edges
    ADD COLUMN IF NOT EXISTS edge_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS source_node_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS target_node_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS label VARCHAR(255),
    ADD COLUMN IF NOT EXISTS condition TEXT;

UPDATE automation_edges
    SET edge_id = edge_key,
        source_node_id = source_node_key,
        target_node_id = target_node_key
WHERE edge_id IS NULL;

-- Unique constraints for upsert support
ALTER TABLE automation_nodes
    ADD CONSTRAINT IF NOT EXISTS uq_auto_nodes_auto_node UNIQUE (automation_id, node_id);

ALTER TABLE automation_edges
    ADD CONSTRAINT IF NOT EXISTS uq_auto_edges_auto_edge UNIQUE (automation_id, edge_id);

-- ──────────────────────────────────────────────
-- 4. Fix automation_runs — normalise columns
-- ──────────────────────────────────────────────
ALTER TABLE automation_runs
    ADD COLUMN IF NOT EXISTS input TEXT,
    ADD COLUMN IF NOT EXISTS output TEXT;

UPDATE automation_runs
    SET input = trigger_payload, output = output_payload
WHERE input IS NULL;

-- ──────────────────────────────────────────────
-- 5. Fix ai_agents — normalise columns
-- ──────────────────────────────────────────────
ALTER TABLE ai_agents
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL;

UPDATE ai_agents SET status = CASE WHEN is_active = 1 THEN 'active' ELSE 'inactive' END;

-- ──────────────────────────────────────────────
-- 6. Fix ai_agent_tools — normalise columns
-- ──────────────────────────────────────────────
ALTER TABLE ai_agent_tools
    ADD COLUMN IF NOT EXISTS enabled SMALLINT DEFAULT 1,
    ADD COLUMN IF NOT EXISTS config TEXT DEFAULT '{}';

UPDATE ai_agent_tools SET enabled = is_enabled WHERE enabled IS NULL OR enabled = 0;

-- ──────────────────────────────────────────────
-- 7. Fix knowledge_bases — add agent_id, status columns
-- ──────────────────────────────────────────────
ALTER TABLE knowledge_bases
    ADD COLUMN IF NOT EXISTS agent_id VARCHAR(36) REFERENCES ai_agents(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- ──────────────────────────────────────────────
-- 8. Fix documents — normalise columns
-- ──────────────────────────────────────────────
ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);

UPDATE documents SET file_name = title WHERE file_name IS NULL;

-- ──────────────────────────────────────────────
-- 9. Add api_connections table (if not exists)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_connections (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    base_url VARCHAR(1024) NOT NULL,
    auth_type VARCHAR(50) DEFAULT 'none', -- none, api_key, bearer, basic
    headers TEXT DEFAULT '{}',            -- JSON headers
    credentials_encrypted TEXT,           -- AES-256-GCM encrypted credentials JSON
    status VARCHAR(50) DEFAULT 'active',
    last_tested_at TIMESTAMP NULL,
    created_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_api_connections_ws ON api_connections(workspace_id);

-- ──────────────────────────────────────────────
-- 10. Add api_requests log table
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_requests (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    connection_id VARCHAR(36) REFERENCES api_connections(id) ON DELETE SET NULL,
    method VARCHAR(10) NOT NULL,
    url VARCHAR(1024) NOT NULL,
    status_code INTEGER,
    duration_ms INTEGER,
    error TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_api_requests_ws ON api_requests(workspace_id, created_at);

-- ──────────────────────────────────────────────
-- 11. Add profile update support (no schema change needed)
-- ──────────────────────────────────────────────

-- ──────────────────────────────────────────────
-- 12. Add indexes for performance
-- ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_ws_stage ON leads(workspace_id, stage);
CREATE INDEX IF NOT EXISTS idx_leads_contact ON leads(contact_id);
CREATE INDEX IF NOT EXISTS idx_notes_lead ON notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_notes_contact ON notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_ws_status ON ai_agents(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_kb_agent ON knowledge_bases(agent_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_ws_next ON scheduled_posts(workspace_id, next_run_at, status);
CREATE INDEX IF NOT EXISTS idx_usage_records_ws_period ON usage_records(workspace_id, period);

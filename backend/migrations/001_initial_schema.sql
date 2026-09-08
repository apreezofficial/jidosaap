-- JidoSapp PostgreSQL Initial Schema Migration
-- Designed for PostgreSQL 14+ / 16 (with pgvector support) and compatible with standard SQL

-- Enable extensions if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ==========================================
-- 1. USERS, SESSIONS & AUTH
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1024),
    status VARCHAR(50) DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS password_resets (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email);

CREATE TABLE IF NOT EXISTS email_verifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- ==========================================
-- 2. WORKSPACES & MULTI-TENANCY
-- ==========================================

CREATE TABLE IF NOT EXISTS workspaces (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(1024),
    timezone VARCHAR(100) DEFAULT 'UTC',
    currency VARCHAR(10) DEFAULT 'USD',
    business_type VARCHAR(100) DEFAULT 'services',
    created_by VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_workspaces_created_by ON workspaces(created_by);

CREATE TABLE IF NOT EXISTS workspace_members (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- owner, admin, member, viewer
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_ws ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);

-- ==========================================
-- 3. BILLING, PLANS & USAGE
-- ==========================================

CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL, -- starter, business, pro, agency
    price_monthly NUMERIC(10, 2) NOT NULL,
    price_yearly NUMERIC(10, 2) NOT NULL,
    limits_json TEXT NOT NULL,
    stripe_price_id_monthly VARCHAR(255),
    stripe_price_id_yearly VARCHAR(255),
    is_active SMALLINT DEFAULT 1,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) UNIQUE NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    plan_id VARCHAR(36) NOT NULL REFERENCES plans(id),
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, trialing, past_due, canceled
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end SMALLINT DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_ws ON subscriptions(workspace_id);

CREATE TABLE IF NOT EXISTS usage_records (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    metric VARCHAR(100) NOT NULL, -- ai_tokens, messages_sent, messages_received, automation_runs, etc.
    quantity INTEGER NOT NULL DEFAULT 1,
    period VARCHAR(20) NOT NULL, -- e.g. '2026-09'
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_usage_records_ws_metric ON usage_records(workspace_id, metric, period);

-- ==========================================
-- 4. WHATSAPP CONNECTIONS & WEBHOOKS
-- ==========================================

CREATE TABLE IF NOT EXISTS whatsapp_connections (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    phone_number_id VARCHAR(100) NOT NULL,
    waba_id VARCHAR(100) NOT NULL,
    access_token_encrypted TEXT NOT NULL,
    webhook_verify_token VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'connected', -- connected, disconnected, expired, error
    connected_at TIMESTAMP,
    last_active_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wa_connections_ws ON whatsapp_connections(workspace_id);
CREATE INDEX IF NOT EXISTS idx_wa_connections_phone_id ON whatsapp_connections(phone_number_id);

CREATE TABLE IF NOT EXISTS whatsapp_webhook_events (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) REFERENCES workspaces(id) ON DELETE CASCADE,
    connection_id VARCHAR(36) REFERENCES whatsapp_connections(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    payload TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'received', -- received, processed, failed
    processed_at TIMESTAMP,
    error TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wa_webhook_ws ON whatsapp_webhook_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_wa_webhook_created ON whatsapp_webhook_events(created_at);

-- ==========================================
-- 5. CONTACTS, COMPANIES & TAGS
-- ==========================================

CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    source VARCHAR(100) DEFAULT 'whatsapp',
    status VARCHAR(50) DEFAULT 'lead',
    notes TEXT,
    avatar_url VARCHAR(1024),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contacts_ws ON contacts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(workspace_id, phone);

CREATE TABLE IF NOT EXISTS tags (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#E11D48',
    created_at TIMESTAMP NOT NULL,
    UNIQUE (workspace_id, name)
);

CREATE TABLE IF NOT EXISTS contact_tags (
    contact_id VARCHAR(36) NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    tag_id VARCHAR(36) NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (contact_id, tag_id)
);

CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    industry VARCHAR(100),
    size VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- ==========================================
-- 6. CONVERSATIONS & MESSAGES
-- ==========================================

CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    contact_id VARCHAR(36) NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    connection_id VARCHAR(36) REFERENCES whatsapp_connections(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'open', -- open, resolved, pending
    handler_mode VARCHAR(50) DEFAULT 'ai', -- ai, human, hybrid
    assigned_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    last_message_at TIMESTAMP,
    unread_count INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_conv_ws ON conversations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_conv_contact ON conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_conv_last_msg ON conversations(workspace_id, last_message_at);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    external_message_id VARCHAR(255),
    direction VARCHAR(20) NOT NULL, -- inbound, outbound
    type VARCHAR(50) NOT NULL DEFAULT 'text', -- text, image, video, document, template
    content TEXT,
    media_url VARCHAR(1024),
    status VARCHAR(50) NOT NULL DEFAULT 'queued', -- queued, sending, sent, delivered, read, failed
    error_message TEXT,
    sender VARCHAR(100),
    recipient VARCHAR(100),
    metadata TEXT, -- JSON
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_ws ON messages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_ext_id ON messages(external_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

CREATE TABLE IF NOT EXISTS message_attachments (
    id VARCHAR(36) PRIMARY KEY,
    message_id VARCHAR(36) NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_url VARCHAR(1024) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- ==========================================
-- 7. CRM: LEADS, DEALS, ACTIVITIES & NOTES
-- ==========================================

CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    contact_id VARCHAR(36) NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    value NUMERIC(12, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    stage VARCHAR(50) NOT NULL DEFAULT 'new', -- new, contacted, qualified, proposal, won, lost
    assigned_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    source VARCHAR(100) DEFAULT 'whatsapp',
    probability INTEGER DEFAULT 20,
    expected_close_date DATE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_ws ON leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(workspace_id, stage);

CREATE TABLE IF NOT EXISTS deals (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    lead_id VARCHAR(36) NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    closed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    contact_id VARCHAR(36) REFERENCES contacts(id) ON DELETE CASCADE,
    lead_id VARCHAR(36) REFERENCES leads(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- note, call, message, automation, status_change
    description TEXT NOT NULL,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activities_ws ON activities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activities_contact ON activities(contact_id);

CREATE TABLE IF NOT EXISTS notes (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    contact_id VARCHAR(36) REFERENCES contacts(id) ON DELETE CASCADE,
    lead_id VARCHAR(36) REFERENCES leads(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- ==========================================
-- 8. CONTENT, TEMPLATES & CALENDAR
-- ==========================================

CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'marketing',
    language VARCHAR(20) DEFAULT 'en',
    body TEXT NOT NULL,
    header TEXT,
    footer TEXT,
    buttons TEXT, -- JSON
    variables TEXT, -- JSON array of variable names
    status VARCHAR(50) DEFAULT 'approved',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_templates_ws ON templates(workspace_id);

CREATE TABLE IF NOT EXISTS content (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    destination VARCHAR(100) DEFAULT 'whatsapp',
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, processing, sent, failed, cancelled
    created_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_ws ON content(workspace_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(workspace_id, status);

CREATE TABLE IF NOT EXISTS content_media (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    media_type VARCHAR(50) NOT NULL, -- image, video, document
    media_url VARCHAR(1024) NOT NULL,
    file_size INTEGER DEFAULT 0,
    caption TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS scheduled_posts (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    content_id VARCHAR(36) NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    connection_id VARCHAR(36) REFERENCES whatsapp_connections(id) ON DELETE SET NULL,
    recipient_type VARCHAR(50) DEFAULT 'broadcast', -- broadcast, contact, segment
    target_recipient VARCHAR(255),
    schedule_type VARCHAR(50) DEFAULT 'once', -- once, recurring
    timezone VARCHAR(100) DEFAULT 'UTC',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    recurrence_rule VARCHAR(255), -- e.g. "FREQ=WEEKLY;BYDAY=MO;BYHOUR=9"
    next_run_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, processing, sent, failed, cancelled
    last_run_at TIMESTAMP,
    idempotency_key VARCHAR(255) UNIQUE,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scheduled_posts_ws ON scheduled_posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_next_run ON scheduled_posts(status, next_run_at);

-- ==========================================
-- 9. API INTEGRATIONS & EXTERNAL CONNECTORS
-- ==========================================

CREATE TABLE IF NOT EXISTS api_connections (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    base_url VARCHAR(1024) NOT NULL,
    method VARCHAR(10) DEFAULT 'GET',
    headers TEXT, -- JSON
    auth_type VARCHAR(50) DEFAULT 'none', -- none, api_key, bearer, basic
    credentials_encrypted TEXT, -- AES-256-GCM
    timeout_seconds INTEGER DEFAULT 30,
    response_mapping TEXT, -- JSON path mappings
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_api_conn_ws ON api_connections(workspace_id);

CREATE TABLE IF NOT EXISTS api_requests (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    connection_id VARCHAR(36) REFERENCES api_connections(id) ON DELETE SET NULL,
    endpoint VARCHAR(1024) NOT NULL,
    status_code INTEGER,
    request_body TEXT,
    response_body TEXT,
    duration_ms INTEGER,
    error TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_api_req_ws ON api_requests(workspace_id);

-- ==========================================
-- 10. VISUAL AUTOMATIONS & EXECUTION ENGINE
-- ==========================================

CREATE TABLE IF NOT EXISTS automations (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active SMALLINT DEFAULT 1,
    trigger_type VARCHAR(100) NOT NULL, -- incoming_message, schedule, webhook, new_contact, new_lead
    config TEXT, -- JSON trigger configuration
    created_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_automations_ws ON automations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_automations_active ON automations(workspace_id, is_active);

CREATE TABLE IF NOT EXISTS automation_nodes (
    id VARCHAR(36) PRIMARY KEY,
    automation_id VARCHAR(36) NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
    node_key VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL, -- trigger, send_whatsapp, send_media, ai_generation, http_request, create_lead, condition, branch, delay, handoff
    label VARCHAR(255) NOT NULL,
    position_x REAL NOT NULL DEFAULT 0,
    position_y REAL NOT NULL DEFAULT 0,
    config TEXT, -- JSON configuration for node parameters
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auto_nodes_auto ON automation_nodes(automation_id);

CREATE TABLE IF NOT EXISTS automation_edges (
    id VARCHAR(36) PRIMARY KEY,
    automation_id VARCHAR(36) NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
    edge_key VARCHAR(100) NOT NULL,
    source_node_key VARCHAR(100) NOT NULL,
    target_node_key VARCHAR(100) NOT NULL,
    source_handle VARCHAR(100),
    target_handle VARCHAR(100),
    condition_expr TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auto_edges_auto ON automation_edges(automation_id);

CREATE TABLE IF NOT EXISTS automation_runs (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    automation_id VARCHAR(36) NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'running', -- running, completed, failed, retrying
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    trigger_payload TEXT, -- JSON
    output_payload TEXT, -- JSON
    error TEXT,
    attempt_count INTEGER DEFAULT 1,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auto_runs_ws ON automation_runs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_auto_runs_auto ON automation_runs(automation_id);
CREATE INDEX IF NOT EXISTS idx_auto_runs_status ON automation_runs(status);

CREATE TABLE IF NOT EXISTS automation_run_steps (
    id VARCHAR(36) PRIMARY KEY,
    run_id VARCHAR(36) NOT NULL REFERENCES automation_runs(id) ON DELETE CASCADE,
    node_key VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed', -- completed, failed, skipped
    input_payload TEXT,
    output_payload TEXT,
    error TEXT,
    duration_ms INTEGER DEFAULT 0,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auto_run_steps_run ON automation_run_steps(run_id);

-- ==========================================
-- 11. AI AGENTS, TOOLS & KNOWLEDGE BASE
-- ==========================================

CREATE TABLE IF NOT EXISTS ai_agents (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    personality VARCHAR(255) DEFAULT 'professional, helpful, and concise',
    tone VARCHAR(100) DEFAULT 'professional',
    language VARCHAR(50) DEFAULT 'en',
    business_info TEXT,
    instructions TEXT NOT NULL,
    working_hours TEXT, -- JSON
    escalation_rules TEXT, -- JSON
    is_active SMALLINT DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_agents_ws ON ai_agents(workspace_id);

CREATE TABLE IF NOT EXISTS ai_agent_tools (
    id VARCHAR(36) PRIMARY KEY,
    agent_id VARCHAR(36) NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL, -- searchKnowledgeBase, searchProducts, createLead, updateLead, addContactTag, requestHumanHandoff
    is_enabled SMALLINT DEFAULT 1,
    parameters_schema TEXT, -- JSON schema
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS knowledge_bases (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_kb_ws ON knowledge_bases(workspace_id);

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    knowledge_base_id VARCHAR(36) NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- pdf, txt, docx, faq, website
    file_size INTEGER DEFAULT 0,
    file_url VARCHAR(1024),
    raw_content TEXT,
    chunk_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'processed', -- pending, processing, processed, error
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_docs_ws ON documents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_docs_kb ON documents(knowledge_base_id);

CREATE TABLE IF NOT EXISTS document_chunks (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER DEFAULT 0,
    embedding TEXT, -- Vector or JSON representation of float array
    metadata TEXT, -- JSON
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_doc_chunks_doc ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_ws ON document_chunks(workspace_id);

-- ==========================================
-- 12. NOTIFICATIONS & AUDIT LOGS
-- ==========================================

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- failed_automation, failed_whatsapp, new_lead, ai_handoff, api_failure, usage_limit
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read SMALLINT DEFAULT 0,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notif_ws_user ON notifications(workspace_id, user_id, is_read);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- user_login, whatsapp_connected, automation_created, etc.
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    metadata TEXT, -- JSON
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_ws ON audit_logs(workspace_id, created_at);

-- ==========================================
-- 13. QUEUE SYSTEM (DATABASE QUEUE FALLBACK)
-- ==========================================

CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    queue VARCHAR(255) NOT NULL DEFAULT 'default',
    payload TEXT NOT NULL,
    attempts SMALLINT NOT NULL DEFAULT 0,
    reserved_at TIMESTAMP NULL,
    available_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_queue_reserved ON jobs(queue, reserved_at);

CREATE TABLE IF NOT EXISTS failed_jobs (
    id VARCHAR(36) PRIMARY KEY,
    connection VARCHAR(255) NOT NULL DEFAULT 'redis',
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP NOT NULL
);

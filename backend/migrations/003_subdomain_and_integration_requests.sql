-- Migration: 003_subdomain_and_integration_requests.sql
-- Table to manage custom client onboarding and subdomain integration requests

CREATE TABLE IF NOT EXISTS integration_requests (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) NOT NULL,
    use_case VARCHAR(100) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    workspace_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_integration_requests_subdomain ON integration_requests(subdomain);
CREATE INDEX IF NOT EXISTS idx_integration_requests_email ON integration_requests(email);

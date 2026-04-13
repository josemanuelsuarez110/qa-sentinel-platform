-- QA Sentinel Production Schema

-- Table: test_runs
-- Stores the high-level metadata for each execution suite
CREATE TABLE IF NOT EXISTS test_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suite_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('queued', 'running', 'passed', 'failed', 'flaky')),
    total_tests INTEGER DEFAULT 0,
    passed_tests INTEGER DEFAULT 0,
    failed_tests INTEGER DEFAULT 0,
    duration_ms INTEGER,
    started_at TIMESTAMPTZ DEFAULT now(),
    finished_at TIMESTAMPTZ,
    tenant_id TEXT NOT NULL,
    meta JSONB
);

-- Table: test_results
-- Stores individual test cases results
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES test_runs(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    status TEXT NOT NULL,
    duration_ms INTEGER,
    error_message TEXT,
    retries INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: flaky_history
-- Tracks instability patterns for self-healing analysis
CREATE TABLE IF NOT EXISTS flaky_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name TEXT NOT NULL,
    fail_count INTEGER DEFAULT 0,
    last_error TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS)
-- Ensuring tenant isolation at the database level
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Simple policy: authenticated users can only see data from their own tenant context
-- Note: In a real app, this would use auth.jwt() -> 'tenant_id'
CREATE POLICY tenant_isolation_policy ON test_runs
    FOR ALL USING (tenant_id = current_setting('app.current_tenant', true));

CREATE POLICY tenant_results_policy ON test_results
    FOR ALL USING (EXISTS (
        SELECT 1 FROM test_runs WHERE id = test_results.run_id AND tenant_id = current_setting('app.current_tenant', true)
    ));

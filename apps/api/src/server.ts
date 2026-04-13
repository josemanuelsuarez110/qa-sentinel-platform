import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { Queue, Worker, Job } from 'bullmq'
import { createClient } from '@supabase/supabase-js'
import { TestRunner } from '@qa/core'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Setup Supabase (Using Service Role for orchestrator tasks if available)
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'mock-key'
export const supabase = createClient(supabaseUrl, supabaseKey)

// Setup Redis Queue — usa REDIS_URL si está disponible (Render lo provee)
const redisUrl = process.env.REDIS_URL
const connection = redisUrl
  ? { url: redisUrl }
  : {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null
    }

const testQueue = new Queue('test-runs', { connection: connection as any })
const runner = new TestRunner()

// --- Multi-process Worker (Real Testing Integration) ---
const testRegistry: Record<string, string> = {
  'core-platform': 'tests/e2e/core-platform.spec.ts',
  'login-validation': 'tests/e2e/login.spec.ts',
  'tenant-isolation': 'tests/e2e/multi-tenant.spec.ts',
  'api-performance': 'tests/e2e/dashboard.spec.ts',
  'critical-flow': 'tests/e2e/critical-flow.spec.ts'
}

// Initialize the worker in the same process
const worker = new Worker('test-runs', async (job: Job) => {
  const { testName, runId } = job.data
  console.log(`[Worker] Processing: ${testName} | Run: ${runId}`)

  const testFilePath = testRegistry[testName]
  if (!testFilePath) throw new Error(`Test file not found for: ${testName}`)

  // Execute the REAL playwright test instead of the simulated function
  return await runner.runRealTest(testFilePath, testName, runId)
}, { connection: connection as any })

worker.on('failed', (job, err) => console.error(`[Worker] Job ${job?.id} failed: ${err.message}`))
console.log('[Worker] Embedded worker active.')
// ----------------------------------------

app.use(cors())
app.use(express.json())

app.post('/run-suite', async (req, res) => {
  const { suiteName, tenantId = 'default-tenant' } = req.body
  
  // 1. Create a Test Run Record in Supabase
  const { data: run, error } = await supabase
    .from('test_runs')
    .insert({
      suite_name: suiteName,
      status: 'queued',
      tenant_id: tenantId,
      started_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('[Backend] Supabase Error:', error)
    return res.status(500).json({ success: false, error: error.message })
  }

  // 2. Queue the individual tests
  const tests = Object.keys(testRegistry)
  const jobs = await Promise.all(tests.map(testName => 
    testQueue.add('execute-test', { 
      testName, 
      runId: run.id,
      tenantId 
    })
  ))

  res.json({ 
    success: true, 
    runId: run.id, 
    jobCount: jobs.length,
    status: 'scheduled'
  })
})

app.get('/test-history', async (req, res) => {
  const { data, error } = await supabase
    .from('test_runs')
    .select('*, test_results(*)')
    .order('started_at', { ascending: false })
    .limit(20)

  if (error) {
    return res.status(500).json({ success: false, error: error.message })
  }

  res.json(data)
})

app.get('/health-stats', async (req, res) => {
  const { data: runs, error } = await supabase
    .from('test_runs')
    .select('status, passed_tests, failed_tests')
    .limit(50)

  if (error) return res.status(500).json({ error: error.message })

  const totalRuns = runs.length
  const successRuns = runs.filter(r => r.status === 'passed').length
  const passRate = totalRuns > 0 ? (successRuns / totalRuns * 100) : 0

  res.json({
    totalRuns,
    passRate: Math.round(passRate),
    activeWorkers: 3, // Mocked for now
    flakyTests: 2 // Mocked for now
  })
})

// --- NEW: Smart Test Insights ---
app.get('/test-insights', async (req, res) => {
  try {
    // 1. Most Unstable Test (highest fail count from flaky_history)
    const { data: flakyData } = await supabase
      .from('flaky_history')
      .select('test_name, fail_count')
      .order('fail_count', { ascending: false })
      .limit(1)
      .single()

    // 2. Average Duration (from last 50 successful tests)
    const { data: durationData } = await supabase
      .from('test_results')
      .select('duration_ms')
      .eq('status', 'passed')
      .limit(50)
    
    const avgDuration = durationData?.length 
      ? Math.round(durationData.reduce((acc, curr) => acc + curr.duration_ms, 0) / durationData.length)
      : 0

    // 3. Recurring Failures (tests that failed > 2 times in last 24h)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: failureData } = await supabase
      .from('test_results')
      .select('test_name')
      .eq('status', 'failed')
      .gt('created_at', yesterday)
    
    const recurringFailures = Object.entries(
      failureData?.reduce((acc: any, curr) => {
        acc[curr.test_name] = (acc[curr.test_name] || 0) + 1
        return acc
      }, {}) || {}
    )
    .filter(([_, count]: any) => count > 1)
    .map(([name, count]) => ({ name, count }))

    res.json({
      mostUnstable: flakyData?.test_name || 'None detected',
      avgDurationMs: avgDuration,
      recurringFailures
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// --- NEW: Simulated AI Diagnostic ---
app.post('/generate-ai-summary', async (req, res) => {
  const { testName, lastError } = req.body
  
  // Simulate AI latency
  await new Promise(r => setTimeout(r, 1200))

  const analysis = lastError?.includes('contamination')
    ? `ANALYSIS: The failure in '${testName}' suggests a state leakage between test iterations. RECOMMENDATION: Review the database teardown logic for the shared environment.`
    : lastError?.includes('timeout')
    ? `ANALYSIS: Network latency or resource exhaustion detected in the test worker. RECOMMENDATION: Increase the Playwright timeout or check worker CPU allocation.`
    : `ANALYSIS: Standard functional failure detected. RECOMMENDATION: Verify the application logic for recent regression in '${testName}'.`

  res.json({
    summary: analysis,
    confidence: 0.94,
    generated_at: new Date().toISOString()
  })
})

// Serve evidence statically
import path from 'path'
const testResultsPath = path.resolve(process.cwd(), '../../test-results')
app.use('/evidence', express.static(testResultsPath))

app.listen(port, () => {
  console.log(`[Backend] Orchestrator running at http://localhost:${port}`)
})

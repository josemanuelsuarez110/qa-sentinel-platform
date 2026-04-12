import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Queue } from 'bullmq'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Setup Supabase (Using Service Role for orchestrator tasks if available)
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'mock-key'
export const supabase = createClient(supabaseUrl, supabaseKey)

// Setup Redis Queue
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null
}

const testQueue = new Queue('test-runs', { connection })

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
  const tests = ['login-validation', 'tenant-isolation', 'api-performance']
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

app.listen(port, () => {
  console.log(`[Backend] Orchestrator running at http://localhost:${port}`)
})

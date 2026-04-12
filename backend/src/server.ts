import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Queue } from 'bullmq'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Setup Supabase (Mocked if no creds)
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'mock-key'
export const supabase = createClient(supabaseUrl, supabaseKey)

import { EventEmitter } from 'events'
export const simulationEvents = new EventEmitter()

// Setup Redis Queue with Simulation Fallback
let testQueue: any
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null
}

try {
  const q = new Queue('test-runs', { connection })
  q.on('error', (err) => {
    console.warn('[Backend] Redis error. Continuing in simulation mode.')
  })
  testQueue = q
  console.log('[Backend] Redis Queue initialized.')
} catch (err) {
  console.warn('[Backend] Redis failed to initialize. Simulation Mode Active.')
  testQueue = null
}

function getTestQueue() {
  if (testQueue && !process.env.SIMULATE) {
    return testQueue
  }
  return {
    add: async (name: string, data: any) => {
      const id = Math.random().toString(36).substring(7)
      setTimeout(() => simulationEvents.emit('job', { id, name, data }), 100)
      return { id }
    }
  }
}

app.use(cors())
app.use(express.json())

app.post('/run-test', async (req, res) => {
  const { testName, tenantId } = req.body
  const queue = getTestQueue()
  
  const job = await queue.add('run-single-test', {
    testName,
    tenantId,
    timestamp: new Date()
  })

  res.json({ success: true, jobId: job.id, mode: testQueue ? 'redis' : 'simulation' })
})

app.post('/run-suite', async (req, res) => {
  const { suiteName } = req.body
  const queue = getTestQueue()
  
  // In a real app, this would query a list of tests for the suite
  const tests = ['login', 'tenant-isolation', 'subscription']
  
  const jobs = await Promise.all(tests.map(testName => 
    queue.add('run-single-test', { testName, suiteName })
  ))

  res.json({ success: true, count: jobs.length, mode: testQueue ? 'redis' : 'simulation' })
})

app.get('/test-history', async (req, res) => {
  // In a real app, this queries Supabase
  // Mocking for now
  res.json([
    { id: '1', name: 'login', status: 'passed', duration: 1200, timestamp: new Date() },
    { id: '2', name: 'tenant-isolation', status: 'failed', duration: 2500, timestamp: new Date() }
  ])
})

app.listen(port, () => {
  console.log(`[Backend] Orchestrator running at http://localhost:${port}`)
})

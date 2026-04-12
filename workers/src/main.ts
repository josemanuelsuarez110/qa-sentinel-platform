import { Worker, Job } from 'bullmq'
import { TestRunner } from '@qa/core'
import dotenv from 'dotenv'

dotenv.config()

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
}

const runner = new TestRunner()

// Simple test registry for simulation
const testRegistry: Record<string, () => Promise<void>> = {
  'login': async () => {
    console.log('[Worker] Simulating Login Test...')
    // Simulating success
    await new Promise(r => setTimeout(r, 1000))
  },
  'tenant-isolation': async () => {
    console.log('[Worker] Simulating Tenant Isolation Test...')
    // Simulating random failure to demonstrate self-healing
    if (Math.random() < 0.3) {
      throw new Error('Tenant data cross-contamination detected!')
    }
    await new Promise(r => setTimeout(r, 1500))
  },
  'subscription': async () => {
    console.log('[Worker] Simulating Subscription Webhook Test...')
    await new Promise(r => setTimeout(r, 800))
  }
}

let worker: any
try {
  worker = new Worker('test-runs', async (job: Job) => {
    console.log(`[Worker] Started job ${job.id} - Test: ${job.data.testName}`)
    
    const testFn = testRegistry[job.data.testName]
    if (!testFn) {
      throw new Error(`Test not found: ${job.data.testName}`)
    }

    const result = await runner.runTest(testFn, job.data.testName)
    
    console.log(`[Worker] Finished job ${job.id} - Status: ${result.status}`)
    return result
  }, { connection })

  worker.on('failed', (job: any, err: any) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`)
  })

  console.log('[Worker] Distributed Test Worker running...')
} catch (err) {
  console.warn('[Worker] Redis not found. Worker in Idle Mode (Simulation handled by Backend).')
}

import { Worker, Job } from 'bullmq'
import { TestRunner } from '@qa/core'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

const redisUrl = process.env.REDIS_URL
const connection = redisUrl
  ? { url: redisUrl }
  : {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    }

const runner = new TestRunner()

// Test registry: simulates real test execution
const testRegistry: Record<string, () => Promise<void>> = {
  'login-validation': async () => {
    console.log('[Worker] Running login validation...')
    await new Promise(r => setTimeout(r, 800))
  },
  'tenant-isolation': async () => {
    console.log('[Worker] Running tenant isolation test...')
    if (Math.random() < 0.3) {
      throw new Error('Tenant data cross-contamination detected!')
    }
    await new Promise(r => setTimeout(r, 1500))
  },
  'api-performance': async () => {
    console.log('[Worker] Running API performance test...')
    await new Promise(r => setTimeout(r, 600))
  },
  'login': async () => {
    await new Promise(r => setTimeout(r, 1000))
  },
  'subscription': async () => {
    await new Promise(r => setTimeout(r, 800))
  }
}

const worker = new Worker('test-runs', async (job: Job) => {
  const { testName, runId, tenantId } = job.data
  console.log(`[Worker] Job ${job.id} — Test: ${testName} | Run: ${runId}`)

  const testFn = testRegistry[testName]
  if (!testFn) {
    throw new Error(`Test not found in registry: ${testName}`)
  }

  const result = await runner.runTest(testFn, testName, runId)
  console.log(`[Worker] Job ${job.id} complete — Status: ${result.status}`)
  return result

}, { connection: connection as any })

worker.on('failed', (job: any, err: any) => {
  console.error(`[Worker] ❌ Job ${job?.id} failed: ${err.message}`)
})

worker.on('error', (err) => {
  console.error('[Worker] 🛑 Redis connection error:', err.message)
})

// --- NEW: Self-Healing & Health Monitoring ---
const heartbeat = setInterval(async () => {
  try {
    const isPaused = await worker.isPaused()
    const count = await worker.getJobCounts()
    console.log(`[Worker] ❤️ Heartbeat | Paused: ${isPaused} | Jobs: ${JSON.stringify(count)}`)
  } catch (err: any) {
    console.warn('[Worker] ⚠️ Heartbeat failed: Redis reachability issue.')
  }
}, 30000)

process.on('SIGTERM', async () => {
  clearInterval(heartbeat)
  await worker.close()
  process.exit(0)
})

console.log('[Worker] 🚀 Distributed Test Worker active and monitoring queue...')

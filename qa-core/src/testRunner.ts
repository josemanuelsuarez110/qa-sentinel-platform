import { test as base, expect } from '@playwright/test'
import { RetryHandler } from './retryHandler'
import { FlakyDetector } from './flakyDetector'
import { Reporter } from './reporter'

export interface TestResult {
  id: string
  name: string
  status: 'passed' | 'failed' | 'flaky' | 'timedOut'
  duration: number
  error?: string
  retries: number
  startTime: Date
}

export class TestRunner {
  private retryHandler: RetryHandler
  private flakyDetector: FlakyDetector
  private reporter: Reporter

  constructor() {
    this.retryHandler = new RetryHandler()
    this.flakyDetector = new FlakyDetector()
    this.reporter = new Reporter()
  }

  async runTest(testFn: () => Promise<void>, name: string): Promise<TestResult> {
    const startTime = new Date()
    let retries = 0
    let lastError: Error | undefined

    while (retries <= this.retryHandler.maxRetries) {
      try {
        console.log(`[TestRunner] Executing: ${name} (Attempt ${retries + 1})`)
        await testFn()
        
        const status = retries > 0 ? 'flaky' : 'passed'
        const result: TestResult = {
          id: Math.random().toString(36).substring(7),
          name,
          status,
          duration: new Date().getTime() - startTime.getTime(),
          retries,
          startTime
        }

        if (status === 'flaky') {
          await this.flakyDetector.recordInstability(name, lastError?.message)
        }

        await this.reporter.report(result)
        return result

      } catch (err: any) {
        lastError = err
        retries++
        if (retries > this.retryHandler.maxRetries) break
        
        console.warn(`[TestRunner] Failure in ${name}: ${err.message}. Retrying...`)
        await this.retryHandler.wait(retries)
      }
    }

    const failedResult: TestResult = {
      id: Math.random().toString(36).substring(7),
      name,
      status: 'failed',
      duration: new Date().getTime() - startTime.getTime(),
      error: lastError?.message,
      retries: retries - 1,
      startTime
    }

    await this.reporter.report(failedResult)
    return failedResult
  }
}

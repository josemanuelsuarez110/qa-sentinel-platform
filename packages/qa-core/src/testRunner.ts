import { test as base, expect } from '@playwright/test'
import { RetryHandler } from './retryHandler'
import { FlakyDetector } from './flakyDetector'
import { Reporter } from './reporter'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface TestResult {
  id: string
  name: string
  status: 'passed' | 'failed' | 'flaky' | 'timedOut'
  duration: number
  errorMessage?: string
  retries: number
  startTime: Date
  screenshotPath?: string
  videoPath?: string
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

  /**
   * Runs a REAL Playwright test file via CLI and parses JSON output
   */
  async runRealTest(filePath: string, name: string, runId?: string): Promise<TestResult> {
    const startTime = new Date()
    console.log(`[TestRunner] Executing REAL Test: ${name} (File: ${filePath})`)

    try {
      // Execute playwright with JSON reporter
      const { stdout } = await execAsync(`npx playwright test ${filePath} --reporter=json`)
      const report = JSON.parse(stdout)
      
      const testCase = report.suites[0]?.specs[0]?.tests[0]
      const result = testCase?.results[0]
      const status = result?.status === 'expected' ? 'passed' : 'failed'

      // Paths for evidence (Playwright defaults) - Normalize to be relative to the test-results folder
      const normalizePath = (p?: string) => {
        if (!p) return undefined
        return p.split('test-results')[1]?.replace(/^[/\\]+/, '') || p
      }

      const testResult: TestResult = {
        id: Math.random().toString(36).substring(7),
        name,
        status: status as any,
        duration: result?.duration || 0,
        errorMessage: result?.error?.message,
        retries: result?.retry || 0,
        startTime,
        screenshotPath: normalizePath(result?.attachments?.find((a: any) => a.name === 'screenshot')?.path),
        videoPath: normalizePath(result?.attachments?.find((a: any) => a.name === 'video')?.path)
      }

      await this.reporter.report(testResult, runId)
      return testResult

    } catch (err: any) {
      // In Playwright, a failed test exits with code 1, which exec treats as an error
      // We check if it's a legitimate execution error or a test failure
      if (err.stdout) {
        try {
          const report = JSON.parse(err.stdout)
          const testCase = report.suites[0]?.specs[0]?.tests[0]
          const result = testCase?.results[0]
          
          const failedResult: TestResult = {
            id: Math.random().toString(36).substring(7),
            name,
            status: 'failed',
            duration: result?.duration || 0,
            errorMessage: result?.error?.message || err.message,
            retries: result?.retry || 0,
            startTime
          }
          await this.reporter.report(failedResult, runId)
          return failedResult
        } catch (e) {
          // Fallback if JSON parsing fails
        }
      }

      const errorResult: TestResult = {
        id: Math.random().toString(36).substring(7),
        name,
        status: 'failed',
        duration: 0,
        errorMessage: err.message,
        retries: 0,
        startTime
      }
      await this.reporter.report(errorResult, runId)
      return errorResult
    }
  }

  async runTest(testFn: () => Promise<void>, name: string, runId?: string): Promise<TestResult> {
    const startTime = new Date()
    let retries = 0
    let lastError: Error | undefined

    while (retries <= this.retryHandler.maxRetries) {
      try {
        console.log(`[TestRunner] Executing Simulation: ${name} (Attempt ${retries + 1})`)
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

        await this.reporter.report(result, runId)
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
      errorMessage: lastError?.message,
      retries: retries - 1,
      startTime
    }

    await this.reporter.report(failedResult, runId)
    return failedResult
  }
}

import { TestResult } from './testRunner'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class Reporter {
  private supabase: SupabaseClient

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_KEY || ''
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async report(result: TestResult, runId?: string): Promise<void> {
    console.log(`[Reporter] Pushing result to Supabase: ${result.name} - Status: ${result.status}`)

    const { error } = await this.supabase
      .from('test_results')
      .insert({
        run_id: runId,
        test_name: result.name,
        status: result.status,
        duration_ms: result.duration,
        error_message: result.errorMessage,
        retries: result.retries || 0,
        created_at: result.startTime.toISOString(),
        screenshot_url: result.screenshotPath,
        video_url: result.videoPath
      })

    if (error) {
      console.error('[Reporter] Failed to save result:', error.message)
    }

    // Update the parent test_run stats
    if (runId) {
      const isPass = result.status === 'passed'
      
      // We use RPC for atomic increments if available, 
      // but here we just fetch and update for simplicity in the demo
      const { data: run } = await this.supabase
        .from('test_runs')
        .select('total_tests, passed_tests, failed_tests')
        .eq('id', runId)
        .single()

      if (run) {
        await this.supabase
          .from('test_runs')
          .update({
            total_tests: run.total_tests + 1,
            passed_tests: isPass ? run.passed_tests + 1 : run.passed_tests,
            failed_tests: !isPass ? run.failed_tests + 1 : run.failed_tests
          })
          .eq('id', runId)
      }
    }
  }
}

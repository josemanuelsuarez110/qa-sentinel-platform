import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class FlakyDetector {
  private supabase: SupabaseClient

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_KEY || ''
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async recordInstability(testName: string, errorMessage?: string): Promise<void> {
    console.warn(`[FlakyDetector] Flagging test as unstable: ${testName}`)
    
    // Upsert into flaky_history table
    // We try to increment fail_count. In Supabase/Postgres we can use rpc or just a simple check-then-update
    
    // Fetch current record
    const { data: current } = await this.supabase
      .from('flaky_history')
      .select('*')
      .eq('test_name', testName)
      .single()

    if (current) {
      await this.supabase
        .from('flaky_history')
        .update({
          fail_count: current.fail_count + 1,
          last_error: errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq('test_name', testName)
    } else {
      await this.supabase
        .from('flaky_history')
        .insert({
          test_name: testName,
          fail_count: 1,
          last_error: errorMessage,
          updated_at: new Date().toISOString()
        })
    }
  }
}

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_KEY are required in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const suiteNames = ['Smoke Test', 'Regression Suite', 'Critical Flow', 'API Security']
const testNames = [
  'Login Validation',
  'Checkout Flow',
  'User Registration',
  'Data Consistency',
  'Tenant Isolation'
]
const statuses = ['passed', 'failed', 'passed', 'passed', 'flaky']

async function populate() {
  console.log('🚀 Populating Supabase with REAL sample data...')

  const tenantId = 'demo-tenant'

  for (let i = 0; i < 5; i++) {
    const suiteName = suiteNames[i % suiteNames.length]
    
    // 1. Create a Test Run
    const { data: run, error: runError } = await supabase
      .from('test_runs')
      .insert({
        suite_name: suiteName,
        status: i === 0 ? 'running' : statuses[i % statuses.length],
        total_tests: 5,
        passed_tests: 4,
        failed_tests: 1,
        duration_ms: Math.floor(Math.random() * 5000) + 2000,
        tenant_id: tenantId,
        started_at: new Date(Date.now() - i * 3600000).toISOString()
      })
      .select()
      .single()

    if (runError) {
      console.error('❌ Error creating run:', runError.message)
      continue
    }

    console.log(`✅ Created run: ${suiteName} (${run.id})`)

    // 2. Create individual test results for this run
    for (const testName of testNames) {
      const status = Math.random() > 0.2 ? 'passed' : 'failed'
      const { error: resultError } = await supabase
        .from('test_results')
        .insert({
          run_id: run.id,
          test_name: testName,
          status,
          duration_ms: Math.floor(Math.random() * 1000) + 500,
          error_message: status === 'failed' ? 'Connection timeout or element not found' : null,
          retries: status === 'failed' ? 1 : 0
        })

      if (resultError) {
        console.error('❌ Error creating result:', resultError.message)
      }
    }
  }

  // 3. Add some flaky history
  const { error: flakyError } = await supabase
    .from('flaky_history')
    .insert([
      { test_name: 'Tenant Isolation', fail_count: 5, last_error: 'Potential data contamination' },
      { test_name: 'Data Consistency', fail_count: 2, last_error: 'Race condition in DB cleanup' }
    ])

  if (flakyError) {
    console.warn('⚠️ Note: Flaky history might already exist or could not be created.')
  }

  console.log('🎉 REAL data population complete! Refresh your dashboard.')
}

populate().catch(console.error)

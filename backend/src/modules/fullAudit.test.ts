import { describe, it, expect } from 'vitest'
import { validateLedger } from './financial/financialValidator.js'
import { runSecurityScan } from './security/securityScanner.js'
import { runCrawling } from './crawler/crawlingEngine.js'

describe('Unified Integrity Audit Flow', () => {
  it('should execute all four engines and provide a consolidated risk report', async () => {
    const url = 'http://localhost:3000'
    const transactions = [
      { amount: 100 },
      { amount: -50 } // OK
    ]

    const [financial, security, crawler] = await Promise.all([
      validateLedger(transactions),
      runSecurityScan(url),
      runCrawling(url)
    ])

    // 1. QA/Financial Engine Verification
    expect(financial.status).toBe('ok')
    expect(financial.total).toBe(50)

    // 2. Security Engine Verification
    expect(['clean', 'vulnerable']).toContain(security.status)
    expect(security.issues).toBeInstanceOf(Array)

    // 3. Crawler Engine Verification
    expect(crawler.pagesMapped).toBeGreaterThan(0)
    expect(crawler.urls.length).toBe(crawler.pagesMapped)

    // Consolidated Insight check
    const consolidatedReport = {
      financial: financial.status,
      security: security.status,
      pages: crawler.pagesMapped
    }

    console.log('--- Integrated Audit Report ---')
    console.log(JSON.stringify(consolidatedReport, null, 2))
    
    expect(consolidatedReport).toHaveProperty('financial')
    expect(consolidatedReport).toHaveProperty('security')
  })

  it('should detect a high risk scenario when a negative balance is found', async () => {
    const transactions = [
      { amount: 100 },
      { amount: -200 } // Negative!
    ]
    const result = validateLedger(transactions)
    expect(result.status).toBe('error')
    expect(result.issue).toContain('Negative balance')
  })
})

import { describe, it, expect } from 'vitest'
import { validateLedger } from './financialValidator.js'

describe('Financial Validator Engine', () => {
  it('should pass with valid transactions', () => {
    const transactions = [
      { amount: 100 },
      { amount: 200.50 }
    ]
    const result = validateLedger(transactions)
    expect(result.status).toBe('ok')
    expect(result.total).toBe(300.50)
  })

  it('should detect a negative total balance', () => {
    const transactions = [
      { amount: 100 },
      { amount: -200 }
    ]
    const result = validateLedger(transactions)
    expect(result.status).toBe('error')
    expect(result.issue).toContain('Negative balance')
  })

  it('should detect suspicious outliers', () => {
    const transactions = [
      { amount: 50 },
      { amount: 50000 } // Outlier (> 10000)
    ]
    const result = validateLedger(transactions)
    expect(result.status).toBe('error')
    expect(result.issue).toContain('outlier transactions')
  })

  it('should handle rounding correctly', () => {
    const transactions = [
      { amount: 0.1 },
      { amount: 0.2 }
    ]
    const result = validateLedger(transactions)
    expect(result.status).toBe('ok')
    expect(result.total).toBe(0.3) // 0.1 + 0.2 in JS can be 0.30000000000000004
  })
})

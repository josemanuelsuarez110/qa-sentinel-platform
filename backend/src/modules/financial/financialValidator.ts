// financialValidator.ts

export interface Transaction {
  amount: number;
  id?: string;
  type: 'debit' | 'credit';
  category?: string;
}

export interface FinancialResult {
  status: "ok" | "warning" | "error";
  issue?: string;
  total: number;
  count: number;
  riskScore: number; // 0-100
  details: {
    reconciliationGap: number;
    roundingAnomalies: number;
  };
}

/**
 * Validates a list of transactions for common financial inconsistencies.
 * Uses Double-Entry Reconciliation patterns and Precision Auditing.
 */
export function validateLedger(transactions: Transaction[]): FinancialResult {
  let totalDebit = 0;
  let totalCredit = 0;
  let roundingAnomalies = 0;

  transactions.forEach(t => {
    // 1. Reconciliation logic
    if (t.type === 'debit') totalDebit += t.amount;
    if (t.type === 'credit') totalCredit += t.amount;

    // 2. Precision Auditing (Finding "Fractional Leaks")
    // If a transaction has more than 2 decimal places, it's often a bug in finance systems
    const decimals = (t.amount.toString().split('.')[1] || '').length;
    if (decimals > 2) roundingAnomalies++;
  });

  const reconciliationGap = Math.abs(totalDebit - totalCredit);
  const totalProcessed = totalDebit + totalCredit;
  
  let status: "ok" | "warning" | "error" = "ok";
  let issue = "";
  let riskScore = 0;

  // Decision Tree
  if (reconciliationGap > 0.01) {
    status = "error";
    issue = `Ledger Mismatch: Reconciliation gap of $${reconciliationGap.toFixed(2)} detected.`;
    riskScore = 85;
  } else if (roundingAnomalies > 0) {
    status = "warning";
    issue = `Precision Alert: ${roundingAnomalies} transactions found with illegal decimal precision.`;
    riskScore = 40;
  }

  // Large transaction outliers (Risk increase)
  const outliers = transactions.filter(t => t.amount > 50000);
  if (outliers.length > 0) {
    riskScore += 10;
    if (status === "ok") {
      status = "warning";
      issue = "High-value transactions detected requiring manual review.";
    }
  }

  return {
    status,
    issue: issue || "All financial integrity assertions passed.",
    total: parseFloat(totalProcessed.toFixed(2)),
    count: transactions.length,
    riskScore: Math.min(riskScore, 100),
    details: {
      reconciliationGap: parseFloat(reconciliationGap.toFixed(4)),
      roundingAnomalies
    }
  };
}

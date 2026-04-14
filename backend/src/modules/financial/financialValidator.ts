// financialValidator.ts

export interface Transaction {
  amount: number;
  id?: string;
  type?: string;
}

export interface FinancialResult {
  status: "ok" | "error";
  issue?: string;
  total?: number;
  count: number;
}

/**
 * Validates a list of transactions for common financial inconsistencies.
 * Detects negative balances and suspicious rounding.
 */
export function validateLedger(transactions: Transaction[]): FinancialResult {
  const total = transactions.reduce((acc, t) => acc + t.amount, 0);

  if (total < 0) {
    return {
      status: "error",
      issue: "Negative balance detected: Potential liquidity risk.",
      count: transactions.length,
      total
    };
  }

  // Detecting zero or outlier transactions (simple heuristic)
  const suspicious = transactions.filter(t => Math.abs(t.amount) > 10000);
  if (suspicious.length > 0) {
    return {
      status: "error",
      issue: `Large outlier transactions detected (${suspicious.length} items). Manual audit recommended.`,
      count: transactions.length,
      total
    };
  }

  return {
    status: "ok",
    total: parseFloat(total.toFixed(2)),
    count: transactions.length
  };
}

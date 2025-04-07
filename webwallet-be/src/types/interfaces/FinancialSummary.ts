export interface FinancialSummary {
    income: { total: number, categories: Record<string, number> };
    expenses: { total: number, categories: Record<string, number> };
    savings: { total: number, categories: Record<string, number> };
    investments?: { total: number, categories: Record<string, number> };
    debt?: { total: number, categories: Record<string, number> };
    credit?: { total: number, categories: Record<string, number> };
    netIncome: number;
    statistics: {
      totalTransactions: number;
      mostActiveDay?: string;
      mostUsedCategories?: Record<string, string>;
      budgets?: {
        total: number;
        exceeded: number;
        onTrack: number;
      }
    };
  }
  
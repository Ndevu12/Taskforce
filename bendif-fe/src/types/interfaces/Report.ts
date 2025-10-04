
export enum ReportType {
  TRANSACTION_SUMMARY = 'TRANSACTION_SUMMARY',
  BUDGET_PERFORMANCE = 'BUDGET_PERFORMANCE',
  EXPENSE_ANALYSIS = 'EXPENSE_ANALYSIS',
  INCOME_ANALYSIS = 'INCOME_ANALYSIS',
  SAVINGS_PROGRESS = 'SAVINGS_PROGRESS',
  CUSTOM = 'CUSTOM'
}

export interface IReport {
  _id: string;
  title: string;
  description?: string;
  type: ReportType;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  createdAt: string;
  updatedAt: string;
  data: any;
}

export interface IReportSummary {
  _id: string;
  title: string;
  type: ReportType;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  createdAt: string;
  summary: {
    transactionCount: number;
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
  };
}

export interface IReportAnalytics {
  totalReports: number;
  reportsByType: Record<string, number>;
  recentReports: Array<{
    _id: string;
    title: string;
    type: string;
    createdAt: Date;
    summary: {
      transactionCount: number;
      totalIncome: number;
      totalExpense: number;
    }
  }>;
  periodSummary: {
    thisMonth: {
      count: number;
      incomeTotal: number;
      expenseTotal: number;
    },
    lastMonth: {
      count: number;
      incomeTotal: number;
      expenseTotal: number;
    },
    percentChange: {
      count: number;
      incomeTotal: number;
      expenseTotal: number;
    }
  };
}

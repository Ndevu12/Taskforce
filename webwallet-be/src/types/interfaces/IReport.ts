import { Document } from 'mongoose';
import { ReportType } from '../enums/ReportType';

export interface IReport extends Document {
  user: string;
  title: string;
  description?: string;
  type: ReportType;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
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

import { BudgetPeriod } from "./Budget";

export interface IReport {
  id: string;
  schedule: string;
  title: string;
  data?: object;
}

export interface IReportSchedule {
  _id: string;
  type: BudgetPeriod;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
}

export interface IReportResponse {
  _id: string;
  schedule: {
    _id: string;
    type: BudgetPeriod;
    title: string;
    startDate: Date | null;
    endDate: Date | null;
  };
  title: string;
  data?: object;
}

export interface IReportSummary {
  _id: string;
  title: string;
  createdAt: string;
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  scheduleType: BudgetPeriod;
}

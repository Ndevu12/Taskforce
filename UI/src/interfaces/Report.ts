import { BudgetPeriod } from "./Budget";

export interface IReport {
  id: string;
  schedule: string;
  title: string;
  data?: object;
}

export interface IReportSchedule {
  id: string;
  type: BudgetPeriod;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
}

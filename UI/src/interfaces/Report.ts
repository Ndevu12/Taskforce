import { BudgetPeriod } from "./Budget";

export interface IReport {
  id: string;
  schedule: string;
  status: string;
  data?: object;
}

export interface IReportSchedule {
  id: string;
  type: BudgetPeriod;
  startDate: Date | null;
  endDate: Date | null;
}

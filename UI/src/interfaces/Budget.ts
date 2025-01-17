export enum BudgetPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
  EXCEEDED = 'EXCEEDED'
}

export interface Budget {
  id: number;
  name: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  description?: string;
  currentSpent: number;
  notificationThreshold: number;
}
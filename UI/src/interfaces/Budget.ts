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
  id: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  description?: string;
  currentSpent: number;
}

export interface BudgetResponse {
  _id: string;
  category: {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  description?: string;
  currentSpent: number;
}
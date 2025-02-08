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
  _id?: string;
  id: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  description?: string;
  currentSpent: number;
  notificationThreshold?: number; // Add notification threshold
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
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  currentSpent: number;
  notificationThreshold?: number;
  isActive?: boolean;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  CREDIT = 'CREDIT',
  DEBT = 'DEBT',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
  NONE = 'NONE'
}

// Define Category interface to fix type error
export interface Category {
  _id: string;
  name: string;
}

// Define Account interface
export interface Account {
  _id: string;
  name: string;
}

// Define Budget interface
export interface Budget {
  _id: string;
  description: string;
}

// Define SubCategory interface
export interface SubCategory {
  _id: string;
  name: string;
}

export interface ITransaction {
  _id?: string;
  user?: string;
  account: string;
  category: string;
  subcategory?: string[];
  amount: number;
  description?: string;
  date: Date;
  budget?: string;
  // Type will be derived from category on the server
}

// For responses from the server that include populated fields and extra details
export interface TransactionResponse {
  _id: string;
  user: string;
  account: Account;
  category: Category; // Now TypeScript knows category has a name property
  subcategory?: SubCategory[];
  amount: number;
  description?: string;
  date: Date;
  budget?: Budget;
  // Type will be derived from category by the server and sent back
  type?: TransactionType;
}

export interface TransactionSummary {
  summary: {
    period: {
      start: string;
      end: string;
    };
    income: {
      categories: Record<string, number>;
      total: number;
    };
    expenses: {
      categories: Record<string, number>;
      total: number;
    };
    savings: {
      categories: Record<string, number>;
      total: number;
    };
    investments: {
      categories: Record<string, number>;
      total: number;
    };
    debt: {
      categories: Record<string, number>;
      total: number;
    };
    credit: {
      categories: Record<string, number>;
      total: number;
    };
    netIncome: number;
    statistics: {
      totalTransactions: number;
      byDate: Record<string, { count: number, amount: number }>;
      mostActiveDay: string;
      mostUsedCategories: Record<string, string>;
    };
  };
  rawTransactions: TransactionResponse[];
}
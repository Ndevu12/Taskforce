export interface ITransaction {
  _id: string;
  account: string;
  category: string;
  subcategory?: string[];
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description?: string;
  date: Date;
}

export interface TransactionResponse {
  _id: string;
  account: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  };
  subcategory?: string[];
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description?: string;
  date: Date;
}
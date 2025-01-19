export interface ITransaction {
  id: string;
  account: string;
  category: string;
  subcategory?: string[];
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description?: string;
  date: Date;
}
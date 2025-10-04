export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'BUDGET_THRESHOLD' | 'TRANSACTION_ALERT';
  createdAt: string;
  read: boolean;
  link?: string;
}

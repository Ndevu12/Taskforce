export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'BUDGET_THRESHOLD' | 'TRANSACTION_ALERT';
  timestamp: string;
  read: boolean;
  link?: string;
}

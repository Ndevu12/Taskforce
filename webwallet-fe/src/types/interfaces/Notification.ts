export interface Notification {
  _id: string;
  user: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

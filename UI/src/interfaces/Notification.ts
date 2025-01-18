export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO date string
  read: boolean; // True if the notification is read
  link?: string; // Optional link for notifications with redirects
}

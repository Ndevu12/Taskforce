import { ScheduleOptions } from 'node-cron';

// East Africa Time - using Africa/Nairobi as EAT timezone
export const DEFAULT_TIMEZONE = 'Africa/Nairobi';

// Target email for scheduled reports
export const REPORT_EMAIL_RECIPIENT = 'jeanpaulelissa99@gmail.com';

// Common schedule options
export const scheduleOptions: ScheduleOptions = {
  timezone: DEFAULT_TIMEZONE,
  scheduled: true
};

// Schedule expressions
export const SCHEDULES = {
  WEEKLY_REPORT: '0 8 * * 0',    // Every Sunday at 8:00 AM
  MONTHLY_REPORT: '0 7 1 * *',   // 1st day of each month at 7:00 AM
  DAILY_CLEANUP: '0 0 * * *',    // Every day at midnight
};

export default {
  DEFAULT_TIMEZONE,
  REPORT_EMAIL_RECIPIENT,
  scheduleOptions,
  SCHEDULES
};

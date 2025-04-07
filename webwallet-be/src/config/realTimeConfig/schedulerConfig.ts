import { ScheduleOptions } from 'node-cron';

// East Africa Time - using Africa/Nairobi as EAT timezone
export const DEFAULT_TIMEZONE = 'Africa/Nairobi';

// First Target email for Testing scheduled reports
export const REPORT_EMAIL_RECIPIENT = process.env.REPORT_EMAIL_RECIPIENT_TEST;

export const scheduleOptions: ScheduleOptions = {
  timezone: DEFAULT_TIMEZONE,
  scheduled: true
};

// Schedule expressions
export const SCHEDULES = {
  WEEKLY_REPORT: '0 8 * * 0',    // Every Sunday at 8:00 AM
  MONTHLY_REPORT: '0 7 1 * *',   // 1st day of each month at 7:00 AM
  DAILY_CLEANUP: '0 0 * * *',    // Every day at midnight
  DAILY_JOB: '0 9 * * *',        // Every day at 9:00 AM
  HOURLY_JOB: '0 * * * *',       // Every hour at minute 0
};

export default {
  DEFAULT_TIMEZONE,
  REPORT_EMAIL_RECIPIENT,
  scheduleOptions,
  SCHEDULES
};

import cron from 'node-cron';
import logger from '../utils/logger';
import { scheduleOptions, SCHEDULES } from '../config/realTimeConfig/schedulerConfig';
import * as UserService from '../services/UserService';
import * as ReportService from '../services/ReportService';
import { formatDateRange } from '../utils/formater/dateFormatter';
import { ReportType } from '../types/enums/ReportType';
import NotificationGatewayService from '../services/NotificationGatewayService';

let isInitialized = false;

/**
 * Initialize the scheduler server
 * @param sendDelayed Set to true to send the first report after a delay
 * @param delayMinutes Number of minutes to delay the initial report (default: 3)
 */
export const initializeSchedulerServer = (sendDelayed = false, delayMinutes = 3): void => {
  if (isInitialized) {
    logger.warn('Scheduler server already initialized');
    return;
  }

  try {
    logger.info('Initializing scheduler server...');
    
    // Schedule weekly report
    scheduleWeeklyReport();
    
    // Schedule monthly report
    scheduleMonthlyReport();
    
    // Schedule daily and hourly jobs based on environment variables
    scheduleConditionalJobs();
    
    // Send first report after delay if requested
    if (sendDelayed) {
      const delayMs = delayMinutes * 60 * 1000; // Convert minutes to milliseconds
      const scheduledTime = new Date(Date.now() + delayMs);
      
      logger.info(`Scheduling initial report to be sent in ${delayMinutes} minutes (at ${scheduledTime.toLocaleTimeString()})...`);
      
      // Run the delayed report in the background
      setTimeout(async () => {
        try {
          logger.info('Preparing to send scheduled initial report now...');
          // Send the weekly report format after delay to all verified users
          await sendFinancialReportToAllVerifiedUsers('weekly');
          logger.info(`Initial weekly reports sent successfully to all verified users`);
        } catch (error) {
          logger.error(`Failed to send initial reports: ${error}`);
        }
      }, delayMs);
    }
    
    isInitialized = true;
    logger.info('Scheduler server initialized successfully');
  } catch (error) {
    logger.error(`Failed to initialize scheduler server: ${error}`);
  }
};

/**
 * Schedule weekly financial report job
 */
const scheduleWeeklyReport = (): void => {
  cron.schedule(SCHEDULES.WEEKLY_REPORT, async () => {
    try {
      logger.info('Running weekly financial report job for all verified users');
      await sendFinancialReportToAllVerifiedUsers('weekly');
      logger.info('Weekly financial report job completed');
    } catch (error) {
      logger.error(`Error in weekly report job: ${error}`);
    }
  }, scheduleOptions);
  
  logger.info(`Scheduled weekly report job with cron: ${SCHEDULES.WEEKLY_REPORT}`);
};

/**
 * Schedule monthly financial report job
 */
const scheduleMonthlyReport = (): void => {
  cron.schedule(SCHEDULES.MONTHLY_REPORT, async () => {
    try {
      logger.info('Running monthly financial report job for all verified users');
      await sendFinancialReportToAllVerifiedUsers('monthly');
      logger.info('Monthly financial report job completed');
    } catch (error) {
      logger.error(`Error in monthly report job: ${error}`);
    }
  }, scheduleOptions);
  
  logger.info(`Scheduled monthly report job with cron: ${SCHEDULES.MONTHLY_REPORT}`);
};

/**
 * Schedule daily financial report job
 */
const scheduleDailyReport = (): void => {
  cron.schedule(SCHEDULES.DAILY_JOB, async () => {
    try {
      logger.info('Running daily financial report job for all verified users');
      await sendFinancialReportToAllVerifiedUsers('daily');
      logger.info('Daily financial report job completed');
    } catch (error) {
      logger.error(`Error in daily report job: ${error}`);
    }
  }, scheduleOptions);
  
  logger.info(`Scheduled daily report job with cron: ${SCHEDULES.DAILY_JOB}`);
};

/**
 * Schedule hourly financial summary job
 */
const scheduleHourlyJob = (): void => {
  cron.schedule(SCHEDULES.HOURLY_JOB, async () => {
    try {
      logger.info('Running hourly financial update job');
      
      await sendFinancialReportToAllVerifiedUsers('hourly');
      
      logger.info('Hourly financial job completed');
    } catch (error) {
      logger.error(`Error in hourly job: ${error}`);
    }
  }, scheduleOptions);
  
  logger.info(`Scheduled hourly job with cron: ${SCHEDULES.HOURLY_JOB}`);
};

/**
 * Schedule jobs based on environment variables
 */
const scheduleConditionalJobs = (): void => {
  // Check if daily job should be scheduled
  if (process.env.SCHEDULE_DAILY === 'true') {
    scheduleDailyReport();
  } else {
    logger.info('Daily job not scheduled (SCHEDULE_DAILY environment variable not set to true)');
  }
  
  // Check if hourly job should be scheduled
  if (process.env.SCHEDULE_HOURLY === 'true') {
    scheduleHourlyJob();
  } else {
    logger.info('Hourly job not scheduled (SCHEDULE_HOURLY environment variable not set to true)');
  }
};

/**
 * Get all verified users from the database
 * @returns Array of verified user objects
 */
async function getVerifiedUsers(): Promise<any[]> {
  try {
    const verifiedUsers = await UserService.findAllVerifiedUsers();
    logger.info(`Found ${verifiedUsers.length} verified users for report distribution`);
    return verifiedUsers;
  } catch (error) {
    logger.error(`Error fetching verified users: ${error}`);
    return [];
  }
}

/**
 * Send financial reports to all verified users
 * @param reportFrequency 'daily', 'weekly' or 'monthly'
 */
async function sendFinancialReportToAllVerifiedUsers(
  reportFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
): Promise<void> {
  try {
    // Get all verified users
    const verifiedUsers = await getVerifiedUsers();
    
    if (verifiedUsers.length === 0) {
      logger.warn('No verified users found to send reports to');
      return;
    }
    
    logger.info(`Preparing to send ${reportFrequency} reports to ${verifiedUsers.length} verified users`);
    
    // Track success and failure counts
    let successCount = 0;
    let failureCount = 0;
    
    // Process each user
    for (const user of verifiedUsers) {
      try {
        await sendFinancialReport(reportFrequency, user);
        successCount++;
        
        // Log progress every 10 users
        if (successCount % 10 === 0) {
          logger.info(`Progress: ${successCount}/${verifiedUsers.length} reports sent successfully`);
        }
      } catch (error) {
        failureCount++;
        logger.error(`Failed to send ${reportFrequency} report to user ${user._id}: ${error}`);
      }
    }
    
    logger.info(`${reportFrequency} report distribution complete. Success: ${successCount}, Failures: ${failureCount}`);
  } catch (error) {
    logger.error(`Error in sendFinancialReportToAllVerifiedUsers: ${error}`);
  }
}

/**
 * Send a financial report to a specific user
 * 
 * @param reportFrequency 'daily', 'weekly' or 'monthly'
 * @param user The user object to send the report to
 */
async function sendFinancialReport(
  reportFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly', 
  user: any
): Promise<void> {
  try {
    if (!user || !user._id) {
      throw new Error('Invalid user object provided');
    }

    const userId = user._id.toString();
    
    // Calculate date range based on frequency
    const today = new Date();
    let startDate: Date, endDate: Date;
    
    if (reportFrequency === 'daily') {
      endDate = new Date(today);
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1); // 24 hours ago
    } else if (reportFrequency === 'weekly') {
      endDate = new Date(today);
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7); // 7 days ago
    } else if (reportFrequency === 'hourly') {
      endDate = new Date(today);
      startDate = new Date(today);
      startDate.setHours(today.getHours() - 1); // 1 hour ago
    } else { // monthly
      endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // First day of previous month
    }

    // Format report period
    const reportPeriod = formatDateRange(startDate, endDate);
    
    // Send transaction summary report
    const transactionTitle = `${reportFrequency.charAt(0).toUpperCase() + reportFrequency.slice(1)} Financial Report`;
    await generateAndSendReport(
      userId,
      startDate,
      endDate,
      transactionTitle,
      ReportType.TRANSACTION_SUMMARY
    );
    
    // Send budget performance report for monthly and weekly reports
    if (reportFrequency === 'monthly' || reportFrequency === 'weekly') {
      const budgetTitle = `${reportFrequency.charAt(0).toUpperCase() + reportFrequency.slice(1)} Budget Performance`;
      await generateAndSendReport(
        userId,
        startDate,
        endDate,
        budgetTitle,
        ReportType.BUDGET_PERFORMANCE
      );
    }
    
    logger.debug(`${reportFrequency} financial report sent to user ${userId} (${user.email})`);
  } catch (error) {
    logger.error(`Error sending ${reportFrequency} financial report to user: ${error}`);
    throw error;
  }
}

/**
 * Generate and send a financial report
 */
async function generateAndSendReport(
  userId: string,
  startDate: Date,
  endDate: Date,
  title: string,
  reportType: ReportType
): Promise<void> {
  try {
    let report;
    
    if (reportType === ReportType.TRANSACTION_SUMMARY) {
      report = await ReportService.generateTransactionSummaryReport(
        userId,
        startDate,
        endDate,
        title
      );
    } else if (reportType === ReportType.BUDGET_PERFORMANCE) {
      report = await ReportService.generateBudgetPerformanceReport(
        userId,
        startDate,
        endDate,
        title
      );
    } else {
      throw new Error('Unsupported report type');
    }

    // Send the report via email - skip ownership check for scheduled reports
    const emailSent = await ReportService.sendReportByEmail(
      (report._id as string).toString(),
      userId,
      true // Skip ownership check for scheduled reports
    );
    
    if (!emailSent) {
      logger.warn(`Failed to email ${title} to user ${userId}`);
      
      // Create notification about the failure
      await NotificationGatewayService.createErrorNotification(
        userId,
        'Report Email Failed',
        `We couldn't send your ${title} via email. You can view it in the reports section.`
      );
    }
  } catch (error) {
    logger.error(`Error generating and sending report: ${error}`);
    throw error;
  }
}

/**
 * Send a report immediately to all verified users
 * @param reportType Type of report to send ('daily', 'weekly' or 'monthly')
 */
export const sendReportImmediatelyToAllUsers = async (
  reportType: 'daily' | 'weekly' | 'monthly' = 'weekly'
): Promise<boolean> => {
  try {
    await sendFinancialReportToAllVerifiedUsers(reportType);
    logger.info(`On-demand ${reportType} reports sent successfully to all verified users`);
    return true;
  } catch (error) {
    logger.error(`Failed to send on-demand ${reportType} reports: ${error}`);
    return false;
  }
};

export default { 
  initializeSchedulerServer,
  sendReportImmediatelyToAllUsers
};

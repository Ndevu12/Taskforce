import { INotification } from '../types/interfaces/INotification';
import NotificationService from './NotificationService';
import logger from '../utils/logger';
import { formattedAmount } from '../utils/formater/moneyFormater';
import { NotificationType } from '../types/enums/NotificationType';
import { ReportType } from '../types/enums/ReportType';

/**
 * Centralized service for creating notifications
 */
class NotificationGatewayService {
  /**
   * Create a notification for account creation
   * 
   * @param userId User ID
   * @param accountName Account name
   */
  async createAccountCreatedNotification(userId: string, accountName: string): Promise<void> {
    try {
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.ACCOUNT_ACTIVITY,
        title: 'Account Created',
        message: `Your new account "${accountName}" has been created successfully.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created account creation notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create account creation notification: ${error}`);
    }
  }

  /**
   * Create a notification for account update
   * 
   * @param userId User ID
   * @param accountName Account name
   */
  async createAccountUpdatedNotification(userId: string, accountName: string): Promise<void> {
    try {
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.ACCOUNT_ACTIVITY,
        title: 'Account Updated',
        message: `Your account "${accountName}" details have been updated.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created account update notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create account update notification: ${error}`);
    }
  }

  /**
   * Create a notification for account deletion
   * 
   * @param userId User ID
   * @param accountName Account name
   */
  async createAccountDeletedNotification(userId: string, accountName: string): Promise<void> {
    try {
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.ACCOUNT_ACTIVITY,
        title: 'Account Deleted',
        message: `Your account "${accountName}" has been deleted.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created account deletion notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create account deletion notification: ${error}`);
    }
  }

  /**
   * Create a notification for significant balance change
   * 
   * @param userId User ID
   * @param accountName Account name
   * @param amount Transaction amount
   * @param isDeposit Whether it's a deposit or withdrawal
   */
  async createSignificantBalanceChangeNotification(
    userId: string, 
    accountName: string,
    amount: number,
    isDeposit: boolean
  ): Promise<void> {
    try {
      const transactionType = isDeposit ? 'deposit to' : 'withdrawal from';
      const Amount = formattedAmount(amount);

      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.ACCOUNT_BALANCE,
        title: 'Significant Transaction',
        message: `A ${transactionType} of ${Amount} was made on your "${accountName}" account.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created significant balance change notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create balance change notification: ${error}`);
    }
  }

  /**
   * Create a notification for budget threshold reached
   * 
   * @param userId User ID
   * @param budgetName Budget name
   * @param percentage Percentage of budget used
   */
  async createBudgetThresholdNotification(
    userId: string,  
    budgetName: string, 
    percentage: number
  ): Promise<void> {
    try {
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.BUDGET_THRESHOLD,
        title: 'Budget Threshold Alert',
        message: `Your "${budgetName}" budget is at ${percentage}% of the limit.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created budget threshold notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create budget threshold notification: ${error}`);
    }
  }

  /**
   * Create a notification for budget creation
   * 
   * @param userId User ID
   * @param budgetName Budget name
   */
  async createBudgetCreatedNotification(userId: string, budgetName: string): Promise<void> {
    try {
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.BUDGET_THRESHOLD,
        title: 'Budget Created',
        message: `Your new budget "${budgetName}" has been created.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created budget creation notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create budget creation notification: ${error}`);
    }
  }

  /**
   * Create a notification for budget exceeded
   * 
   * @param userId User ID
   * @param budgetName Budget name
   * @param categoryName Category name
   */
  async createBudgetExceededNotification(
    userId: string,
    budgetName: string,
    categoryName: string
  ): Promise<void> {
    try {
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.ALERT,
        title: 'Budget Exceeded',
        message: `Your budget for ${categoryName} has exceeded the limit. \n\nBudget description: ${budgetName}`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created budget exceeded notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create budget exceeded notification: ${error}`);
    }
  }

  /**
   * Create a notification for transaction creation
   * 
   * @param userId User ID
   * @param amount Transaction amount
   * @param description Transaction description
   * @param accountName Account name
   */
  async createTransactionCreatedNotification(
    userId: string,
    amount: number,
    description: string,
    accountName: string
  ): Promise<void> {
    try {
      const formattedAmt = formattedAmount(amount);
      
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.TRANSACTION_ALERT,
        title: 'Transaction Created',
        message: `A new transaction of ${formattedAmt} for "${description}" has been created on your ${accountName} account.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created transaction creation notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create transaction creation notification: ${error}`);
    }
  }

  /**
   * Create a notification for transaction update
   * 
   * @param userId User ID
   * @param amount Transaction amount
   * @param description Transaction description
   * @param accountName Account name
   */
  async createTransactionUpdatedNotification(
    userId: string,
    amount: number,
    description: string,
    accountName: string
  ): Promise<void> {
    try {
      const formattedAmt = formattedAmount(amount);
      
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.TRANSACTION_ALERT,
        title: 'Transaction Updated',
        message: `Your transaction of ${formattedAmt} for "${description}" on account ${accountName} has been updated.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created transaction update notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create transaction update notification: ${error}`);
    }
  }

  /**
   * Create a notification for transaction deletion
   * 
   * @param userId User ID
   * @param amount Transaction amount
   * @param description Transaction description
   * @param accountName Account name
   */
  async createTransactionDeletedNotification(
    userId: string,
    amount: number,
    description: string,
    accountName: string
  ): Promise<void> {
    try {
      const formattedAmt = formattedAmount(amount);
      
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.TRANSACTION_ALERT,
        title: 'Transaction Deleted',
        message: `Your transaction of ${formattedAmt} for "${description}" on account ${accountName} has been deleted.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created transaction deletion notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create transaction deletion notification: ${error}`);
    }
  }

  /**
   * Create a notification for report generation
   * 
   * @param userId User ID
   * @param reportTitle Report title
   * @param reportType Report type
   */
  async createReportGeneratedNotification(
    userId: string,
    reportTitle: string,
    reportType: ReportType
  ): Promise<void> {
    try {
      const reportTypeStr = reportType === ReportType.TRANSACTION_SUMMARY 
        ? 'Transaction Summary' 
        : 'Budget Performance';
      
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.INFO,
        title: 'Report Generated',
        message: `Your ${reportTypeStr} report "${reportTitle}" has been generated successfully.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created report generation notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create report generation notification: ${error}`);
    }
  }

  /**
   * Create a notification for report emailed to user
   * 
   * @param userId User ID
   * @param reportTitle Report title
   * @param reportPeriod Report period
   */
  async createReportEmailedNotification(
    userId: string,
    reportTitle: string,
    reportPeriod: string
  ): Promise<void> {
    try {
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.INFO,
        title: 'Report Emailed',
        message: `Your report "${reportTitle}" for period ${reportPeriod} has been sent to your email.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created report emailed notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create report emailed notification: ${error}`);
    }
  }

  /**
   * Create a notification for large expense warning
   * 
   * @param userId User ID
   * @param amount Transaction amount
   * @param description Transaction description
   * @param accountName Account name
   */
  async createLargeExpenseWarningNotification(
    userId: string,
    amount: number,
    description: string,
    accountName: string
  ): Promise<void> {
    try {
      const formattedAmt = formattedAmount(amount);
      
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.WARNING,
        title: 'Large Expense Warning',
        message: `A large expense of ${formattedAmt} for "${description}" has been recorded on your ${accountName} account.`,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created large expense warning notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create large expense warning notification: ${error}`);
    }
  }

  /**
   * Create a generic success notification
   * 
   * @param userId User ID
   * @param title Notification title
   * @param message Notification message
   */
  async createSuccessNotification(
    userId: string,
    title: string,
    message: string
  ): Promise<void> {
    try {
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.SUCCESS,
        title: title,
        message: message,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created success notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create success notification: ${error}`);
    }
  }

  /**
   * Create a generic error notification
   * 
   * @param userId User ID
   * @param title Notification title
   * @param message Notification message
   */
  async createErrorNotification(
    userId: string,
    title: string,
    message: string
  ): Promise<void> {
    try {
      await NotificationService.createNotification({
        user: userId,
        type: NotificationType.ERROR,
        title: title,
        message: message,
        read: false
      } as unknown as INotification);
      
      logger.info(`Created error notification for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to create error notification: ${error}`);
    }
  }
}

export default new NotificationGatewayService();

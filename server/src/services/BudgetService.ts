import Budget from '../models/Budget';
import Notification from '../models/Notification';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import ReportSchedule from '../models/ReportSchedule';
import { IBudget } from '../types/interfaces/IBudget';
import { ITransaction } from '../types/interfaces/ITransaction';
import { BudgetPeriod } from '../types/enums/BudgetPeriod';
import { ReportType } from '../types/enums/ReportType';
import { NotificationType } from '../types/enums/NotificationType';
import { autoGenerateReports } from './ReportService';
import { createNotification } from './NotificationService';
import logger from '../utils/logger';
import mongoose from 'mongoose';
import { findUserById } from './UserService';
import { INotification } from '../types/interfaces/INotification';
import { createReportSchedule } from './ReportScheduleService';
import { io } from '../app';

export const createBudget = async (budgetData: IBudget) => {
  const budget = new Budget(budgetData);
  const savedBudget = await budget.save();
  io.emit('budgetCreated', savedBudget);
  await checkBudgetExceed(savedBudget);
  return savedBudget;
};

export const getBudgetsByUser = async (userId: string) => {
  return await Budget.find({ user: userId }).populate('category');
};

export const updateBudgetById = async (budgetId: string, updateData: Partial<IBudget>) => {
  const updatedBudget = await Budget.findByIdAndUpdate(budgetId, updateData, { new: true });
  io.emit('budgetUpdated', updatedBudget);
  if (updatedBudget) {
    await checkBudgetExceed(updatedBudget);
  }
  return updatedBudget;
};

export const findExceededReportScheduleByUser = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    logger.error(`User not found with ID: ${userId}`);
    return null;
  }

  return await ReportSchedule.findOne({
    user: user,
    type: BudgetPeriod.EXCEEDED
  });
};

export const deleteBudgetById = async (budgetId: string) => {
  const deletedBudget = await Budget.findByIdAndDelete(budgetId);
  io.emit('budgetDeleted', budgetId);
  return deletedBudget;
};

const checkBudgetExceed = async (budget: IBudget) => {
  if (!budget) {
    logger.error('Budget data has to be provided');
    return null;
  }

  const user = await findUserById(budget.user);
  if (!user) {
    logger.error(`User not found with ID: ${budget.user}`);
    return null;
  }

  const transactions: ITransaction[] = await Transaction.find({
    user: budget.user,
    date: { $gte: budget.startDate, $lte: budget.endDate }
  });

  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  if (totalSpent > budget.amount) {
    const userId = budget.user;
    let exceededSchedule = await findExceededReportScheduleByUser(userId);
    if (!exceededSchedule) {
      const reportScheduleData = {
        user: userId,
        type: BudgetPeriod.EXCEEDED,
        startDate: null,
        endDate: null
      };
      try {
        exceededSchedule = await createReportSchedule(reportScheduleData);
      } catch (error: any) {
        logger.error(`Failed to create exceeded report schedule for user ${userId}: ${error.message}`);
        return null;
      }
    }

    let reportData;
    if (exceededSchedule) {
      reportData = await autoGenerateReports(
        user._id as unknown as mongoose.Schema.Types.ObjectId,
        exceededSchedule._id as unknown as mongoose.Schema.Types.ObjectId,
        undefined,
        BudgetPeriod.EXCEEDED
      );
    }

    const category = await Category.findById(budget.category);
    const categoryName = category ? category.name : 'Expense';

    const notificationData: Partial<INotification> = {
      user: budget.user,
      type: NotificationType.BUDGET_THRESHOLD,
      message: `Your budget for ${categoryName} has exceeded the limit.\n\nReport:\n${JSON.stringify(reportData)}`,
      read: false
    };

    try {
      await createNotification(notificationData as INotification);
    } catch (error: any) {
      logger.error(`Failed to create notification for user ${userId}: ${error.message}`);
      return null;
    }

    io.emit('budgetExceeded', budget);
  }
};

export const checkBudgetExceedForTransaction = async (transaction: ITransaction) => {
  logger.info('Checking budget exceed for transaction...');

  console.log('Transaction:', transaction);
  const budgets = await getBudgetsByUser(transaction.user);
  if (budgets.length === 0) {
    logger.warn(`No budgets found for user ${transaction.user}`);
    return;
  }

  logger.info(`Found ${budgets.length} budgets before filters for user ${transaction.user}`);

  // Further filter the budgets based on date range
  const filteredBudgets = budgets.filter(budget => {
    const isWithinDateRange = budget.startDate <= transaction.date && budget.endDate >= transaction.date;
    logger.info(`Budget ID: ${budget._id}, isWithinDateRange: ${isWithinDateRange}`);
    return isWithinDateRange;
  });

  logger.info(`Budgets after date filter: ${filteredBudgets.length}`);

  if (filteredBudgets.length === 0) {
    logger.warn(`No budget filtered with all criteria for the transaction for user ${transaction.user}.`);
    return;
  }

  logger.info(`Found ${filteredBudgets.length} budgets after filters applied for user ${transaction.user}`);

  for (const budget of filteredBudgets) {
    const transactions = await Transaction.find({
      user: budget.user,
      category: budget.category,
      date: { $gte: budget.startDate, $lte: budget.endDate }
    });

    const totalSpent = transactions.reduce((sum, trans) => sum + trans.amount, 0);
    if (totalSpent > budget.amount) {
      const userId = budget.user;
      let exceededSchedule = await findExceededReportScheduleByUser(userId);

      if (!exceededSchedule) {
        const reportScheduleData = {
          user: userId,
          type: BudgetPeriod.EXCEEDED,
          startDate: null,
          endDate: null
        };
        try {
          exceededSchedule = await createReportSchedule(reportScheduleData);
        } catch (error: any) {
          logger.error(`Failed to create exceeded report schedule for user ${userId}: ${error.message}`);
          return null;
        }
      }

      let reportData;
      if (exceededSchedule) {
        reportData = await autoGenerateReports(
          userId as unknown as mongoose.Schema.Types.ObjectId,
          exceededSchedule._id as unknown as mongoose.Schema.Types.ObjectId,
          undefined,
          BudgetPeriod.EXCEEDED
        );
      }

      const category = await Category.findById(budget.category);
      const categoryName = category ? category.name : 'EXPENSE';

      const notificationData: Partial<INotification> = {
        user: budget.user,
        type: NotificationType.BUDGET_THRESHOLD,
        message: `Your budget for ${categoryName} has exceeded the limit.\n\nReport:\n${JSON.stringify(reportData)}`,
        read: false
      };
      
      try {
        await createNotification(notificationData as INotification);
        } catch (error: any) {
          logger.error(`Failed to create notification for user ${userId}: ${error.message}`);
          return null
        }

      io.emit('budgetExceeded', budget);
    }
  }
};

export const updateBudgetOnTransactionCreate = async (transactionData: ITransaction) => {
  logger.info('Updating budget on transaction create...');

  const budgets = await Budget.find({ user: transactionData.user });

  if (budgets.length === 0) {
    logger.warn('No budgets found for the transaction.');
    return;
  }

  logger.info(`Found ${budgets.length} budgets before filters`);

  // Apply date range filter
  const dateFilteredBudgets = budgets.filter(budget =>
    budget.startDate <= transactionData.date && budget.endDate >= transactionData.date
  );

  logger.info(`Budgets after date filter: ${dateFilteredBudgets.length}`);

  if (dateFilteredBudgets.length === 0) {
    logger.warn('No budget found after date filter for the transaction.');
    return;
  }

  logger.info(`Found ${dateFilteredBudgets.length} budgets after filters applied`);

  for (const budget of dateFilteredBudgets) {
    budget.currentSpent += transactionData.amount;
    await budget.save();
    await checkBudgetExceed(budget);
  }
};

export const updateBudgetOnTransactionUpdate = async (existingTransaction: ITransaction, updatedTransaction: ITransaction) => {
  logger.info('Updating budget on transaction update...');

  const budgets = await Budget.find({ user: updatedTransaction.user });

  if (budgets.length === 0) {
    logger.warn('No budgets found for the transaction.');
    return;
  }

  logger.info(`Found ${budgets.length} budgets before filters`);

  // Apply date range filter
  const dateFilteredBudgets = budgets.filter(budget =>
    budget.startDate <= updatedTransaction.date && budget.endDate >= updatedTransaction.date
  );

  logger.info(`Budgets after date filter: ${dateFilteredBudgets.length}`);

  if (dateFilteredBudgets.length === 0) {
    logger.warn('No budget found after date filter for the transaction.');
    return;
  }

  logger.info(`Found ${dateFilteredBudgets.length} budgets after filters applied`);

  for (const budget of dateFilteredBudgets) {
    budget.currentSpent -= existingTransaction.amount;
    budget.currentSpent += updatedTransaction.amount;
    await budget.save();
    await checkBudgetExceed(budget);
  }
};

import Budget from '../models/Budget';
import Notification from '../models/Notification';
import Transaction from '../models/Transaction';
import ReportSchedule from '../models/ReportSchedule';
import { IBudget } from '../types/interfaces/IBudget';
import { ITransaction } from '../types/interfaces/ITransaction';
import { BudgetPeriod } from '../types/enums/BudgetPeriod';
import { ReportType } from '../types/enums/ReportType';
import { autoGenerateReports } from './ReportService';
import logger from '../utils/logger';
import mongoose from 'mongoose';
import { findUserById } from './UserService';


export const createBudget = async (budgetData: IBudget) => {
  const budget = new Budget(budgetData);
  await budget.save();
  await checkBudgetExceed(budget);
  return budget;
};

export const getBudgetsByUser = async (userId: string) => {
  return await Budget.find({ user: userId });
};

export const updateBudgetById = async (budgetId: string, updateData: Partial<IBudget>) => {
  const budget = await Budget.findByIdAndUpdate(budgetId, updateData, { new: true });
  if (budget) {
    await checkBudgetExceed(budget);
  }
  return budget;
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
  return await Budget.findByIdAndDelete(budgetId);
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
    category: budget.category,
    date: { $gte: budget.startDate, $lte: budget.endDate }
  });

  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  if (totalSpent > budget.amount) {
    const notificationData = {
      user: budget.user,
      message: `Your budget for ${budget.category} has exceeded the limit.`,
      read: false
    };
    const notification = new Notification(notificationData);
    await notification.save();

    const userId = budget.user;
    let exceededSchedule = await findExceededReportScheduleByUser(userId);
    if (!exceededSchedule) {
      logger.info(`No exceeded schedule found. Creating exceeded report schedule for user ${userId}`);
      const reportScheduleData = {
        user: userId,
        type: BudgetPeriod.EXCEEDED,
        startDate: null,
        endDate: null
      };
      try {
        exceededSchedule = new ReportSchedule(reportScheduleData);
        await exceededSchedule.save();
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

    notification.message += `\n\nReport:\n${JSON.stringify(reportData)}`;
    await notification.save();
  }
};

export const checkBudgetExceedForTransaction = async (transaction: ITransaction) => {
  logger.info('Started checking budget exceed for transaction:', transaction);

  const budgets = await Budget.find({
    user: transaction.user,
    category: transaction.category,
    startDate: { $lte: transaction.date },
    endDate: { $gte: transaction.date }
  });

  logger.info('Found budgets:', budgets);

  for (const budget of budgets) {
    const transactions = await Transaction.find({
      user: budget.user,
      category: budget.category,
      date: { $gte: budget.startDate, $lte: budget.endDate }
    });

    const totalSpent = transactions.reduce((sum, trans) => sum + trans.amount, 0);

    logger.info(`Total spent for budget ${budget._id}: ${totalSpent}`);

    if (totalSpent > budget.amount) {
      const notificationData = {
        user: budget.user,
        message: `Your budget for ${budget.category} has exceeded the limit.`,
        read: false
      };
      const notification = new Notification(notificationData);
      await notification.save();

      logger.info('Created notification:', notification);

      const userId = budget.user;
      let exceededSchedule = await findExceededReportScheduleByUser(userId);

      logger.info('Found exceeded schedule:', exceededSchedule);

      if (!exceededSchedule) {
        logger.info(`No exceeded schedule found. Creating exceeded report schedule for user ${userId}`);
        const reportScheduleData = {
          user: userId,
          type: BudgetPeriod.EXCEEDED,
          startDate: null,
          endDate: null
        };
        try {
          exceededSchedule = new ReportSchedule(reportScheduleData);
          await exceededSchedule.save();
        } catch (error: any) {
          logger.error(`Failed to create exceeded report schedule for user ${userId}: ${error.message}`);
          return null;
        }
      }

      let reportData;
      if (exceededSchedule) {

        logger.info('Generating exceeded report afer founding exceeded schedule...................');

        reportData = await autoGenerateReports(
          userId as unknown as mongoose.Schema.Types.ObjectId,
          exceededSchedule._id as unknown as mongoose.Schema.Types.ObjectId,
          undefined,
          BudgetPeriod.EXCEEDED
        );
      }
      notification.message += `\n\nReport:\n${JSON.stringify(reportData)}`;
      await notification.save();
    }
  }
};

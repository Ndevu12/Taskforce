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
import mongoose from 'mongoose';
import { findUserById } from './UserService';
import { INotification } from '../types/interfaces/INotification';
import { createReportSchedule } from './ReportScheduleService';
import { io } from '../app';

export const createBudget = async (budgetData: IBudget) => {
  const budget = new Budget(budgetData);
  const savedBudget = await budget.save();
  io.emit('budgetCreated', savedBudget);

  const notificationData: Partial<INotification> = {
    user: budget.user,
    type: NotificationType.BUDGET_THRESHOLD,
    message: `A new budget has been created for ${budget.description}.`,
    read: false,
    link: '/dashboard/budgets',
  };
  await createNotification(notificationData as INotification);

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
    const notificationData: Partial<INotification> = {
      user: updatedBudget.user,
      type: NotificationType.BUDGET_THRESHOLD,
      message: `The budget for ${updatedBudget.description} has been updated.`,
      read: false,
      link: '/dashboard/budgets',
    };
    await createNotification(notificationData as INotification);
  }

  if (updatedBudget) {
    await checkBudgetExceed(updatedBudget);
  }
  return updatedBudget;
};

export const getBudgetById = async (budgetId: string) => {
  return await Budget.findById(budgetId);
}

export const findExceededReportScheduleByUser = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    return null;
  }

  return await ReportSchedule.findOne({
    user: user,
    type: BudgetPeriod.EXCEEDED
  });
};

export const deleteBudgetById = async (budgetId: string): Promise<boolean> => {
  const budget = await Budget.findById(budgetId);
  if (!budget) {
    return false;
  }

  const deletedBudget = await Budget.findByIdAndDelete(budgetId);
  io.emit('budgetDeleted', budgetId);

  if (budget) {
    const notificationData: Partial<INotification> = {
      user: budget.user,
      type: NotificationType.BUDGET_THRESHOLD,
      message: `The budget for ${budget.description} has been deleted.`,
      read: false,
      link: '/dashboard/budgets',
    };
    await createNotification(notificationData as INotification);
  }
  return true;
};

const checkBudgetExceed = async (budget: IBudget) => {
  if (!budget) {
    return null;
  }

  const user = await findUserById(budget.user);
  if (!user) {
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
      message: `Your budget for ${categoryName} has exceeded the limit. \n\nBudget description: ${budget.description}`,
      read: false,
      link: '/dashboard/budgets',
    };

    try {
      await createNotification(notificationData as INotification);
    } catch (error: any) {
      return null;
    }

    io.emit('budgetExceeded', budget);
  }
};

export const checkBudgetExceedForTransaction = async (transaction: ITransaction) => {
  const budgets = await getBudgetsByUser(transaction.user);
  if (budgets.length === 0) {
    return;
  }

  const filteredBudgets = budgets.filter(budget => {
    return budget.startDate <= transaction.date && budget.endDate >= transaction.date;
  });

  if (filteredBudgets.length === 0) {
    return;
  }

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
        message: `Your budget for ${categoryName} has exceeded the limit. \n\nBudget description: ${budget.description}`,
        read: false,
        link: '/dashboard/budgets',
      };
      
      try {
        await createNotification(notificationData as INotification);
      } catch (error: any) {
        return null;
      }

      io.emit('budgetExceeded', budget);
    }
  }
};

export const updateBudgetOnTransactionCreate = async (transactionData: ITransaction) => {
  const budgets = await Budget.find({ user: transactionData.user });

  if (budgets.length === 0) {
    return;
  }

  const dateFilteredBudgets = budgets.filter(budget =>
    budget.startDate <= transactionData.date && budget.endDate >= transactionData.date
  );

  if (dateFilteredBudgets.length === 0) {
    return;
  }

  for (const budget of dateFilteredBudgets) {
    budget.currentSpent += transactionData.amount;
    await budget.save();
    await checkBudgetExceed(budget);
  }
};

export const updateBudgetOnTransactionUpdate = async (existingTransaction: ITransaction, updatedTransaction: ITransaction) => {
  const budgets = await Budget.find({ user: updatedTransaction.user });

  if (budgets.length === 0) {
    return;
  }

  const dateFilteredBudgets = budgets.filter(budget =>
    budget.startDate <= updatedTransaction.date && budget.endDate >= updatedTransaction.date
  );

  if (dateFilteredBudgets.length === 0) {
    return;
  }

  for (const budget of dateFilteredBudgets) {
    budget.currentSpent -= existingTransaction.amount;
    budget.currentSpent += updatedTransaction.amount;
    await budget.save();
    await checkBudgetExceed(budget);
  }
};

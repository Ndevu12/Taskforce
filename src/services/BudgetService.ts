import Budget from '../models/Budget';
import Notification from '../models/Notification';
import Transaction from '../models/Transaction';
import { IBudget } from '../types/interfaces/IBudget';
import { ITransaction } from '../types/interfaces/ITransaction';
import { generateReport } from './ReportService';

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

export const deleteBudgetById = async (budgetId: string) => {
  return await Budget.findByIdAndDelete(budgetId);
};

const checkBudgetExceed = async (budget: IBudget) => {
  const transactions: ITransaction[] = await Transaction.find({
    user: budget.user,
    category: budget.category,
    date: { $gte: budget.startDate }
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

    const reportData = await generateReport({
      userId: budget.user,
      type: 'BUDGET_STATUS',
      startDate: budget.startDate,
      endDate: new Date()
    });
    notification.message += `\n\nReport:\n${JSON.stringify(reportData)}`;
    await notification.save();
  }
};

export const checkBudgetExceedForTransaction = async (transaction: ITransaction) => {
  const budgets = await Budget.find({
    user: transaction.user,
    category: transaction.category,
    startDate: { $lte: transaction.date },
    endDate: { $gte: transaction.date }
  });

  for (const budget of budgets) {
    const transactions = await Transaction.find({
      user: budget.user,
      category: budget.category,
      date: { $gte: budget.startDate, $lte: budget.endDate }
    });

    const totalSpent = transactions.reduce((sum, trans) => sum + trans.amount, 0);

    if (totalSpent > budget.amount) {
      const notificationData = {
        user: budget.user,
        message: `Your budget for ${budget.category} has exceeded the limit.`,
        read: false
      };
      const notification = new Notification(notificationData);
      await notification.save();

      const reportData = await generateReport({
        userId: budget.user,
        type: 'BUDGET_STATUS',
        startDate: budget.startDate,
        endDate: new Date()
      });
      notification.message += `\n\nReport:\n${JSON.stringify(reportData)}`;
      await notification.save();
    }
  }
};
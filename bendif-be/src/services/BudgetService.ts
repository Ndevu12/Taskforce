import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import { IBudget } from '../types/interfaces/IBudget';
import { ITransaction } from '../types/interfaces/ITransaction';
import { NotificationType } from '../types/enums/NotificationType';
import { createNotification } from './NotificationService';
import mongoose from 'mongoose';
import { findUserById } from './UserService';
import { INotification } from '../types/interfaces/INotification';
import { isExpenseCategory } from '../utils/categoryUtils';
import logger from '../utils/logger';
import NotificationGatewayService from './NotificationGatewayService';

export const createBudget = async (budgetData: IBudget) => {
  try {
    const budget = new Budget(budgetData);
    const savedBudget = await budget.save();
    
    if (savedBudget) {
    await NotificationGatewayService.createBudgetCreatedNotification(
      savedBudget.user.toString(),
      savedBudget?.description || 'New'
    );
  }
    return savedBudget;
  } catch (error) {
    logger.error(`Error creating budget: ${error}`);
    throw error;
  }
};

export const getBudgetsByUser = async (userId: string) => {
  return await Budget.find({ user: userId }).populate('category');
};

export const updateBudgetById = async (budgetId: string, updateData: Partial<IBudget>) => {
  const updatedBudget = await Budget.findByIdAndUpdate(budgetId, updateData, { new: true });

  if (updatedBudget) {
    const notificationData: Partial<INotification> = {
      user: updatedBudget.user,
      type: NotificationType.BUDGET_THRESHOLD,
      message: `The budget for ${updatedBudget.description} has been updated.`,
      read: false
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
};

export const deleteBudgetById = async (budgetId: string): Promise<boolean> => {
  const budget = await Budget.findById(budgetId);
  if (!budget) {
    return false;
  }

  const deletedBudget = await Budget.findByIdAndDelete(budgetId);

  if (deletedBudget) {
    const notificationData: Partial<INotification> = {
      user: budget.user,
      type: NotificationType.BUDGET_THRESHOLD,
      message: `The budget for ${budget.description} has been deleted.`,
      read: false
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
    const category = await Category.findById(budget.category);
    const categoryName = category ? category.name : 'Expense';

    // Create budget exceeded notification
    await NotificationGatewayService.createBudgetExceededNotification(
      budget.user.toString(),
      budget.description || 'Unnamed Budget',
      categoryName
    );
  }
};

export const checkBudgetExceedForTransaction = async (transaction: ITransaction) => {
  try {
    // Check if this is an expense category transaction and has a budget
    const isExpense = await isExpenseCategory(transaction.category.toString());
    if (!isExpense || !transaction.budget) {
      return null;
    }
    
    const budget = await Budget.findById(transaction.budget).populate('category');
    if (!budget) {
      return null;
    }
    
    const spentPercentage = (budget.currentSpent / budget.amount) * 100;
    const category = budget.category as any;
    const categoryName = category?.name || 'this category';
    
    if (spentPercentage >= budget.notificationThreshold && spentPercentage < 100) {
      return {
        message: `Warning: You've spent ${spentPercentage.toFixed(0)}% of your budget for ${budget.description || categoryName}`,
        threshold: budget.notificationThreshold,
        percentage: spentPercentage,
        budgetId: budget._id,
        categoryName
      };
    } else if (spentPercentage >= 100) {
      return {
        message: `Alert: You've exceeded your budget for ${budget.description || categoryName}`,
        threshold: 100,
        percentage: spentPercentage,
        budgetId: budget._id,
        categoryName
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error checking budget exceed:', error);
    return null;
  }
};

export const updateBudgetOnTransactionCreate = async (
  transaction: ITransaction,
  session?: mongoose.ClientSession
) => {
  try {
    // Check if the transaction has an expense category and a budget
    const isExpense = await isExpenseCategory(transaction.category.toString());
    if (!isExpense || !transaction.budget) {
      return null;
    }

    const budget = session 
      ? await Budget.findById(transaction.budget).session(session) 
      : await Budget.findById(transaction.budget);
      
    if (!budget) {
      return null;
    }

    // Ensure transaction is within budget date range
    if (transaction.date < budget.startDate || transaction.date > budget.endDate) {
      return null; // Transaction date outside budget period
    }

    budget.currentSpent += transaction.amount;
    
    const updatedBudget = session 
      ? await budget.save({ session }) 
      : await budget.save();
      
    await checkBudgetExceed(updatedBudget);
    return updatedBudget;
  } catch (error) {
    console.error('Error updating budget on transaction create:', error);
    return null;
  }
};

export const updateBudgetOnTransactionUpdate = async (
  oldTransaction: ITransaction,
  newTransaction: ITransaction,
  session?: mongoose.ClientSession
) => {
  try {
    // Check old and new transaction categories
    const wasExpense = await isExpenseCategory(oldTransaction.category.toString());
    const isExpense = await isExpenseCategory(newTransaction.category.toString());
    
    // Handle case where an expense transaction is being modified
    if (wasExpense && isExpense) {
      // If budget changed, update both old and new budgets
      if (oldTransaction.budget?.toString() !== newTransaction.budget?.toString()) {
        // Decrease amount in old budget if it exists
        if (oldTransaction.budget) {
          const oldBudget = session 
            ? await Budget.findById(oldTransaction.budget).session(session) 
            : await Budget.findById(oldTransaction.budget);
            
          if (oldBudget) {
            oldBudget.currentSpent -= oldTransaction.amount;
            session ? await oldBudget.save({ session }) : await oldBudget.save();
          }
        }
        
        // Increase amount in new budget if it exists
        if (newTransaction.budget) {
          const newBudget = session 
            ? await Budget.findById(newTransaction.budget).session(session) 
            : await Budget.findById(newTransaction.budget);
            
          if (newBudget) {
            newBudget.currentSpent += newTransaction.amount;
            session ? await newBudget.save({ session }) : await newBudget.save();
          }
        }
      } 
      // If same budget but amount changed
      else if (oldTransaction.amount !== newTransaction.amount && newTransaction.budget) {
        const budget = session 
          ? await Budget.findById(newTransaction.budget).session(session) 
          : await Budget.findById(newTransaction.budget);
          
        if (budget) {
          // Adjust by the difference
          const amountDifference = newTransaction.amount - oldTransaction.amount;
          budget.currentSpent += amountDifference;
          session ? await budget.save({ session }) : await budget.save();
        }
      }
    } 
    // Handle case where transaction category changed to or from expense
    else if (wasExpense && !isExpense) {
      // Remove amount from old budget
      if (oldTransaction.budget) {
        const oldBudget = session 
          ? await Budget.findById(oldTransaction.budget).session(session) 
          : await Budget.findById(oldTransaction.budget);
          
        if (oldBudget) {
          oldBudget.currentSpent -= oldTransaction.amount;
          session ? await oldBudget.save({ session }) : await oldBudget.save();
        }
      }
    } 
    else if (!wasExpense && isExpense) {
      // Add amount to new budget
      if (newTransaction.budget) {
        const newBudget = session 
          ? await Budget.findById(newTransaction.budget).session(session) 
          : await Budget.findById(newTransaction.budget);
          
        if (newBudget) {
          newBudget.currentSpent += newTransaction.amount;
          session ? await newBudget.save({ session }) : await newBudget.save();
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error updating budget on transaction update:', error);
    return null;
  }
};

export const updateBudgetOnTransactionDelete = async (
  transaction: ITransaction,
  session?: mongoose.ClientSession
) => {
  try {
    // Check if the transaction is an expense and has a budget
    const isExpense = await isExpenseCategory(transaction.category.toString());
    if (!isExpense || !transaction.budget) {
      return null;
    }

    const budget = session 
      ? await Budget.findById(transaction.budget).session(session) 
      : await Budget.findById(transaction.budget);
      
    if (!budget) {
      return null;
    }

    budget.currentSpent -= transaction.amount;
    
    return session 
      ? await budget.save({ session }) 
      : await budget.save();
  } catch (error) {
    console.error('Error updating budget on transaction delete:', error);
    return null;
  }
};

/**
 * Check if budget has any associated transactions
 */
export const checkBudgetHasTransactions = async (budgetId: string): Promise<boolean> => {
  const transactionCount = await Transaction.countDocuments({ budget: budgetId });
  return transactionCount > 0;
};

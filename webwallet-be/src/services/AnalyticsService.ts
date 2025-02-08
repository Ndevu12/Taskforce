import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import Budget from '../models/Budget';
import { TransactionType } from '../types/enums/TransactionType';
import { AccountType } from '../types/enums/AccountType';
import { getTransactionTypeFromCategoryName } from '../utils/categoryUtils';

/**
 * Generate comprehensive dashboard overview analytics for a user
 */
export const getDashboardOverview = async (userId: string) => {
  // Get current date info for period calculations
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
  const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfLastMonth = new Date(currentYear, currentMonth, 0);
  
  // Fetch all user accounts
  const accounts = await Account.find({ user: userId });
  
  // Fetch all transactions in current month
  const currentMonthTransactions = await Transaction.find({
    user: userId,
    date: { $gte: startOfMonth, $lte: endOfMonth }
  }).populate('category').populate('account');
  
  // Fetch all transactions in previous month for comparison
  const lastMonthTransactions = await Transaction.find({
    user: userId,
    date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
  }).populate('category');
  
  // Fetch recent transactions (last 30 days)
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const recentTransactions = await Transaction.find({
    user: userId,
    date: { $gte: last30Days }
  })
    .sort({ date: -1 })
    .limit(10)
    .populate('category')
    .populate('account')
    .populate('subCategory')
    .populate('budget');
  
  // Fetch budget information
  const budgets = await Budget.find({
    user: userId,
    endDate: { $gte: now }
  }).populate('category');

  // 1. Account balances analytics
  const accountsAnalytics = {
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
    accountsByType: accounts.reduce((acc: Record<string, number>, account) => {
      const type = account.type;
      if (!acc[type]) acc[type] = 0;
      acc[type] += account.balance;
      return acc;
    }, {}),
    // Add specific metrics for credit and investment accounts
    creditTotal: accounts
      .filter(a => a.type === AccountType.CREDIT)
      .reduce((sum, a) => sum + a.balance, 0),
    investmentTotal: accounts
      .filter(a => a.type === AccountType.INVESTMENT)
      .reduce((sum, a) => sum + a.balance, 0),
    accounts: accounts.map(account => ({
      id: account._id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency
    }))
  };

  // Helper function to get transaction type from category
  const getTypeForTransaction = (transaction: any): TransactionType => {
    const categoryName = transaction.category?.name || '';
    return getTransactionTypeFromCategoryName(categoryName);
  };
  
  // 2. Income & expense analytics
  const incomeThisMonth = currentMonthTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expensesThisMonth = currentMonthTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const incomeLastMonth = lastMonthTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expensesLastMonth = lastMonthTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate daily income/expense for chart
  const dailyTransactions = Array(endOfMonth.getDate())
    .fill(0)
    .map((_, i) => {
      const day = i + 1;
      const date = new Date(currentYear, currentMonth, day);
      const dayTransactions = currentMonthTransactions.filter(t => 
        new Date(t.date).getDate() === day
      );
      
      return {
        date: date.toISOString().split('T')[0],
        income: dayTransactions
          .filter(t => getTypeForTransaction(t) === TransactionType.INCOME)
          .reduce((sum, t) => sum + t.amount, 0),
        expense: dayTransactions
          .filter(t => getTypeForTransaction(t) === TransactionType.EXPENSE)
          .reduce((sum, t) => sum + t.amount, 0)
      };
    });

  const incomeExpenseAnalytics = {
    currentMonth: {
      income: incomeThisMonth,
      expenses: expensesThisMonth,
      netIncome: incomeThisMonth - expensesThisMonth,
    },
    previousMonth: {
      income: incomeLastMonth,
      expenses: expensesLastMonth,
      netIncome: incomeLastMonth - expensesLastMonth,
    },
    percentChange: {
      income: incomeLastMonth ? ((incomeThisMonth - incomeLastMonth) / incomeLastMonth) * 100 : 0,
      expenses: expensesLastMonth ? ((expensesThisMonth - expensesLastMonth) / expensesLastMonth) * 100 : 0,
      netIncome: incomeLastMonth - expensesLastMonth ? 
        (((incomeThisMonth - expensesThisMonth) - (incomeLastMonth - expensesLastMonth)) / 
        (incomeLastMonth - expensesLastMonth)) * 100 : 0
    },
    dailyTransactions
  };

  // 3. Budget Performance
  const budgetAnalytics = budgets.map(budget => {
    const percentUsed = (budget.currentSpent / budget.amount) * 100;
    return {
      id: budget._id,
      description: budget.description,
      category: budget.category,
      amount: budget.amount,
      currentSpent: budget.currentSpent,
      percentUsed,
      isExceeded: percentUsed >= 100,
      isApproachingLimit: percentUsed >= budget.notificationThreshold && percentUsed < 100,
      remaining: budget.amount - budget.currentSpent,
      startDate: budget.startDate,
      endDate: budget.endDate,
    };
  });

  // 4. Savings & Investment Analysis
  const savingsThisMonth = currentMonthTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.SAVINGS)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const investmentThisMonth = currentMonthTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.INVESTMENT)
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Get total savings and investment from all transaction history
  const allTransactions = await Transaction.find({ user: userId }).populate('category');
  
  const totalSavings = allTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.SAVINGS)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalInvestments = allTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.INVESTMENT)
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsInvestmentAnalytics = {
    currentMonth: {
      savings: savingsThisMonth,
      investment: investmentThisMonth,
    },
    total: {
      savings: totalSavings + (accountsAnalytics.accountsByType[AccountType.SAVINGS] || 0),
      investment: totalInvestments + accountsAnalytics.investmentTotal,
    }
  };

  // 5. Spending by Category
  const spendingByCategory = currentMonthTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.EXPENSE)
    .reduce((acc: Record<string, number>, transaction) => {
      const categoryName = transaction.category ? 
        (transaction.category as any).name || 'Uncategorized' : 
        'Uncategorized';
        
      if (!acc[categoryName]) acc[categoryName] = 0;
      acc[categoryName] += transaction.amount;
      return acc;
    }, {});

  // 6. Financial Health Indicators
  // Get debt-related information from transactions and credit accounts
  const debtTransactions = currentMonthTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.DEBT);
  
  const creditTransactions = currentMonthTransactions
    .filter(t => getTypeForTransaction(t) === TransactionType.CREDIT);
    
  const debtTotal = debtTransactions.reduce((sum, t) => sum + t.amount, 0);
  const creditTotal = Math.max(0, -accountsAnalytics.creditTotal); // Consider negative balance as debt

  const financialHealthAnalytics = {
    savingsRate: incomeThisMonth ? (savingsThisMonth / incomeThisMonth) * 100 : 0,
    expenseRatio: incomeThisMonth ? (expensesThisMonth / incomeThisMonth) * 100 : 0,
    debtTotal: debtTotal + creditTotal,
    creditUtilization: accountsAnalytics.creditTotal < 0 ? Math.abs(accountsAnalytics.creditTotal) : 0,
    // Debt service ratio: monthly debt payments / monthly income
    debtServiceRatio: incomeThisMonth ? 
      ((debtTransactions.reduce((sum, t) => sum + t.amount, 0) + 
        creditTransactions.reduce((sum, t) => sum + t.amount, 0)) / incomeThisMonth) * 100 : 0,
    investmentRatio: incomeThisMonth ? (investmentThisMonth / incomeThisMonth) * 100 : 0
  };

  // Add derived transaction types to recent transactions for frontend
  const enhancedRecentTransactions = recentTransactions.map(transaction => {
    const transactionObj = transaction.toObject() as any;
    const categoryName = (transaction.category as any)?.name || '';
    (transactionObj as { type?: TransactionType }).type = getTransactionTypeFromCategoryName(categoryName);
    return transactionObj;
  });

  // Return the complete analytics package
  return {
    timestamp: new Date(),
    accounts: accountsAnalytics,
    incomeExpense: incomeExpenseAnalytics,
    budgets: budgetAnalytics,
    savingsInvestment: savingsInvestmentAnalytics,
    spendingByCategory,
    financialHealth: financialHealthAnalytics,
    recentTransactions: enhancedRecentTransactions
  };
};

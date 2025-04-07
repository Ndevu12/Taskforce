import mongoose from 'mongoose';
import Report from '../models/Report';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';
import User from '../models/User';
import { IReport, IReportAnalytics } from '../types/interfaces/IReport';
import { TransactionType } from '../types/enums/TransactionType';
import { ReportType } from '../types/enums/ReportType';
import logger from '../utils/logger';
import { getTransactionTypeFromCategoryName } from '../utils/categoryUtils';
import NotificationGatewayService from './NotificationGatewayService';
import { sendReportEmail } from '../helpers/emailHandlers/emailHandlers';
import { formatDateRange } from '../utils/formater/dateFormatter';
import { FinancialSummary } from '../types/interfaces/FinancialSummary';

/**
 * Create a new report with validation
 */
export const createReport = async (reportData: Partial<IReport>): Promise<IReport> => {
  try {
    const report = new Report(reportData);
    await report.save();
    return report;
  } catch (error) {
    logger.error(`Error creating report: ${error}`);
    throw error;
  }
};

/**
 * Get reports by user with proper security
 */
export const getReportsByUser = async (userId: string): Promise<IReport[]> => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    logger.warn('Invalid user ID provided to getReportsByUser');
    throw new Error('Invalid user ID');
  }

  try {
    return await Report.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email'); // Only include necessary user fields
  } catch (error) {
    logger.error(`Error fetching reports for user ${userId}: ${error}`);
    throw error;
  }
};

/**
 * Get single report with validation
 */
export const getReportById = async (reportId: string): Promise<IReport | null> => {
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    logger.warn(`Invalid report ID format: ${reportId}`);
    throw new Error('Invalid report ID format');
  }
  
  try {
    const report = await Report.findById(reportId)
      .populate('user', 'name email');
    
    if (!report) {
      logger.info(`Report not found with ID: ${reportId}`);
    }
    
    return report;
  } catch (error) {
    logger.error(`Error fetching report ${reportId}: ${error}`);
    throw error;
  }
};

/**
 * Delete report with proper validation
 */
export const deleteReport = async (reportId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    logger.warn(`Invalid report ID format for deletion: ${reportId}`);
    throw new Error('Invalid report ID format');
  }
  
  try {
    const result = await Report.findByIdAndDelete(reportId);
    if (!result) {
      logger.info(`No report found to delete with ID: ${reportId}`);
      return false;
    }
    
    logger.info(`Successfully deleted report ${reportId}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting report ${reportId}: ${error}`);
    throw error;
  }
};

/**
 * Generate transaction summary report
 */
export const generateTransactionSummaryReport = async (
  userId: string, 
  startDate: Date, 
  endDate: Date, 
  title: string
): Promise<IReport> => {
  try {
    // Get transactions in the date range
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    })
    .populate('category')
    .populate('account')
    .sort({ date: 1 });
    
    // Group transactions by category and type
    const categorySummary = transactions.reduce((result: any, transaction: any) => {
      const categoryName = transaction.category?.name || 'Uncategorized';
      const type = getTransactionTypeFromCategoryName(categoryName);
      
      if (!result[type]) {
        result[type] = {};
      }
      
      if (!result[type][categoryName]) {
        result[type][categoryName] = {
          count: 0,
          total: 0,
          transactions: []
        };
      }
      
      result[type][categoryName].count++;
      result[type][categoryName].total += transaction.amount;
      result[type][categoryName].transactions.push({
        id: transaction._id,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        account: transaction.account?.name || 'Unknown Account'
      });
      
      return result;
    }, {});
    
    // Prepare summary totals
    const summary = {
      totalTransactions: transactions.length,
      byType: {} as Record<string, { count: number, total: number }>
    };
    
    // Group transactions by derived type
    const transactionsByType: Record<string, any[]> = {};
    
    transactions.forEach(transaction => {
      const categoryName = (transaction.category as any)?.name || 'Uncategorized';
      const type = getTransactionTypeFromCategoryName(categoryName);
      
      if (!transactionsByType[type]) {
        transactionsByType[type] = [];
      }
      
      transactionsByType[type].push(transaction);
    });
    
    // Calculate totals for each type
    Object.keys(TransactionType).forEach(type => {
      const filteredTransactions = transactionsByType[type] || [];
      summary.byType[type] = {
        count: filteredTransactions.length,
        total: filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
      };
    });
    
    // Create report
    const reportData = {
      user: userId,
      title: title || `Transaction Report: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      type: ReportType.TRANSACTION_SUMMARY,
      dateRange: {
        startDate,
        endDate
      },
      data: {
        transactions,
        categorySummary,
        summary
      }
    };
    
    const report = await createReport(reportData);

    // Create notification for report generation
    await NotificationGatewayService.createReportGeneratedNotification(
      userId,
      title || `Transaction Report: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      ReportType.TRANSACTION_SUMMARY
    );
    
    return report;
  } catch (error) {
    logger.error(`Error generating transaction summary: ${error}`);
    throw error;
  }
};

/**
 * Generate budget performance report
 */
export const generateBudgetPerformanceReport = async (
  userId: string, 
  startDate: Date, 
  endDate: Date,
  title: string
): Promise<IReport> => {
  try {
    // Get budgets active in the date range
    const budgets = await Budget.find({
      user: userId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    }).populate('category');
    
    // Get transactions for each budget
    const budgetPerformance = [];
    
    for (const budget of budgets) {
      // Find transactions with matching category (expense transactions)
      const transactions = await Transaction.find({
        user: userId,
        category: budget.category,
        date: { 
          $gte: new Date(Math.max(budget.startDate.getTime(), startDate.getTime())),
          $lte: new Date(Math.min(budget.endDate.getTime(), endDate.getTime()))
        }
      });
      
      // Get category type to ensure it's an expense
      const categoryName = (budget.category as any)?.name || '';
      const categoryType = getTransactionTypeFromCategoryName(categoryName);
      
      // Only include expense transactions
      const expenseTransactions = transactions.filter(() => categoryType === TransactionType.EXPENSE);
      
      const totalSpent = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      const percentUsed = (totalSpent / budget.amount) * 100;
      
      budgetPerformance.push({
        id: budget._id,
        description: budget.description,
        category: budget.category,
        amount: budget.amount,
        totalSpent,
        percentUsed,
        isExceeded: totalSpent > budget.amount,
        transactions: expenseTransactions.map(t => ({
          id: t._id,
          amount: t.amount,
          date: t.date,
          description: t.description
        }))
      });
    }
    
    // Create report
    const reportData = {
      user: userId,
      title: title || `Budget Performance: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      type: ReportType.BUDGET_PERFORMANCE,
      dateRange: {
        startDate,
        endDate
      },
      data: {
        budgets: budgetPerformance,
        summary: {
          totalBudgets: budgets.length,
          exceededBudgets: budgetPerformance.filter(b => b.isExceeded).length,
          onTrackBudgets: budgetPerformance.filter(b => !b.isExceeded).length
        }
      }
    };
    
    const report = await createReport(reportData);
    
    // Create notification for report generation
    await NotificationGatewayService.createReportGeneratedNotification(
      userId,
      title || `Budget Performance: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      ReportType.BUDGET_PERFORMANCE
    );

    // Check for exceeded budgets and create notifications
    const exceededBudgets = budgetPerformance.filter(b => b.isExceeded);
    if (exceededBudgets.length > 0) {
      for (const budget of exceededBudgets) {
        const categoryName = (typeof budget.category === 'object' && (budget.category as any).name as string) 
          ? (budget.category as any).name as string
          : 'this category';
          
        await NotificationGatewayService.createBudgetExceededNotification(
          userId,
          budget.description || 'Unnamed Budget',
          categoryName
        );
      }
    }
    
    return report;
  } catch (error) {
    logger.error(`Error generating budget performance report: ${error}`);
    throw error;
  }
};

/**
 * Get reports analytics for a user
 */
export const getReportsAnalytics = async (userId: string): Promise<IReportAnalytics> => {
  try {
    // Get all reports for this user
    const reports = await Report.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100); // Limit to reasonable number
    
    // Get current and previous month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Reports by type
    const reportsByType = reports.reduce((result: Record<string, number>, report) => {
      if (!result[report.type]) {
        result[report.type] = 0;
      }
      result[report.type]++;
      return result;
    }, {});
    
    // Recent reports with summary
    const recentReports = reports.slice(0, 5).map(report => {
      const summary = report.get('summary') || {
        transactionCount: 0,
        totalIncome: 0,
        totalExpense: 0
      };
      
      return {
        _id: report._id as string,
        title: report.title,
        type: report.type as string,
        createdAt: report.createdAt,
        summary
      };
    });
    
    // Period summaries
    const thisMonthReports = reports.filter(r => r.createdAt >= currentMonthStart);
    const lastMonthReports = reports.filter(
      r => r.createdAt >= lastMonthStart && r.createdAt <= lastMonthEnd
    );
    
    // Calculate totals
    const thisMonthIncome = thisMonthReports.reduce(
      (total, r) => total + ((r.get('summary') || {}).totalIncome || 0), 0
    );
    const thisMonthExpense = thisMonthReports.reduce(
      (total, r) => total + ((r.get('summary') || {}).totalExpense || 0), 0
    );
    const lastMonthIncome = lastMonthReports.reduce(
      (total, r) => total + ((r.get('summary') || {}).totalIncome || 0), 0
    );
    const lastMonthExpense = lastMonthReports.reduce(
      (total, r) => total + ((r.get('summary') || {}).totalExpense || 0), 0
    );
    
    // Calculate percent changes
    const calculatePercentChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };
    
    return {
      totalReports: reports.length,
      reportsByType,
      recentReports,
      periodSummary: {
        thisMonth: {
          count: thisMonthReports.length,
          incomeTotal: thisMonthIncome,
          expenseTotal: thisMonthExpense,
        },
        lastMonth: {
          count: lastMonthReports.length,
          incomeTotal: lastMonthIncome,
          expenseTotal: lastMonthExpense,
        },
        percentChange: {
          count: calculatePercentChange(thisMonthReports.length, lastMonthReports.length),
          incomeTotal: calculatePercentChange(thisMonthIncome, lastMonthIncome),
          expenseTotal: calculatePercentChange(thisMonthExpense, lastMonthExpense)
        }
      }
    };
  } catch (error) {
    logger.error(`Error generating reports analytics: ${error}`);
    throw error;
  }
};

/**
 * Prepare financial summary data for email reports
 * 
 * @param userId User ID to prepare report for
 * @param startDate Start date for the report period
 * @param endDate End date for the report period
 * @returns Financial summary data formatted for email reports
 */
export const prepareFinancialSummaryForEmail = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<FinancialSummary> => {
  try {
    // Get all transactions for the specified period
    const { summary } = await getTransactionsSummary(userId, startDate, endDate);

    // Format the data for the email template
    const financialSummary: FinancialSummary = {
      income: summary.income,
      expenses: summary.expenses,
      savings: summary.savings,
      netIncome: summary.netIncome,
      statistics: summary.statistics,
    };

    // Add optional investment data if it exists
    if (summary.investments && Object.keys(summary.investments.categories).length > 0) {
      financialSummary.investments = summary.investments;
    }

    // Add optional debt data if it exists
    if (summary.debt && Object.keys(summary.debt.categories).length > 0) {
      financialSummary.debt = summary.debt;
    }
    
    return financialSummary;
  } catch (error) {
    logger.error(`Error preparing financial summary for email: ${error}`);
    throw error;
  }
};

/**
 * Get transactions summary for the given period
 */
export const getTransactionsSummary = async (userId: string, startDate: Date, endDate: Date) => {
  try {
    // Convert dates to strings for the TransactionService
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Import here to avoid circular dependency
    const { getTransactionsSummary: getTransactionsSummaryFromService } = require('./TransactionService');
    
    // Get transaction data from TransactionService
    return await getTransactionsSummaryFromService(userId, startDateStr, endDateStr);
  } catch (error) {
    logger.error(`Error getting transactions summary: ${error}`);
    throw error;
  }
};

/**
 * Send a report via email
 * 
 * @param reportId ID of the report to send
 * @param userId ID of the user who owns the report
 * @param skipOwnershipCheck Optional flag to skip ownership check for scheduled reports
 * @returns Success status
 */
export const sendReportByEmail = async (
  reportId: string, 
  userId: string, 
  skipOwnershipCheck = false
): Promise<boolean> => {
  try {
    // Get the report
    const report = await getReportById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }
    
    // Check if report belongs to the user (skip if explicitly requested)
    if (!skipOwnershipCheck) {
      // Convert IDs to strings for safe comparison
      const reportUserId = typeof report.user === 'object' && '_id' in report.user 
        ? (report.user as any)._id.toString() 
        : report.user.toString();
      
      logger.debug(`Report ownership check: reportUserId=${reportUserId}, userId=${userId}`);
      
      if (reportUserId !== userId) {
        throw new Error('Unauthorized access to report');
      }
    }
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { dateRange, title, type, data } = report;
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const reportPeriod = formatDateRange(startDate, endDate);

    // Prepare financial summary data based on report type
    let financialSummary: FinancialSummary;
    if (type === ReportType.TRANSACTION_SUMMARY) {
      // Either use data from the report or get fresh data
      if (data && data.summary) {
        // Transform report data to email format
        financialSummary = {
          income: {
            total: data.summary.byType.INCOME?.total || 0,
            categories: extractCategoriesFromReport(data.categorySummary?.INCOME || {})
          },
          expenses: {
            total: data.summary.byType.EXPENSE?.total || 0,
            categories: extractCategoriesFromReport(data.categorySummary?.EXPENSE || {})
          },
          savings: {
            total: data.summary.byType.SAVINGS?.total || 0,
            categories: extractCategoriesFromReport(data.categorySummary?.SAVINGS || {})
          },
          netIncome: (data.summary.byType.INCOME?.total || 0) - (data.summary.byType.EXPENSE?.total || 0),
          statistics: {
            totalTransactions: data.summary.totalTransactions || 0,
            mostActiveDay: findMostActiveDay(data.transactions || [])
          }
        };

        // Add optional investment data
        if (data.summary.byType.INVESTMENT) {
          financialSummary.investments = {
            total: data.summary.byType.INVESTMENT.total || 0,
            categories: extractCategoriesFromReport(data.categorySummary?.INVESTMENT || {})
          };
        }

        // Add optional debt data
        if (data.summary.byType.DEBT) {
          financialSummary.debt = {
            total: data.summary.byType.DEBT.total || 0,
            categories: extractCategoriesFromReport(data.categorySummary?.DEBT || {})
          };
        }
      } else {
        // Get fresh data if report doesn't have the required structure
        financialSummary = await prepareFinancialSummaryForEmail(userId, startDate, endDate);
      }
    } else if (type === ReportType.BUDGET_PERFORMANCE) {
      // Transform budget performance data to financial summary format
      financialSummary = {
        income: { total: 0, categories: {} },
        expenses: { 
          total: data.budgets.reduce((sum: number, budget: any) => sum + budget.totalSpent, 0),
          categories: data.budgets.reduce((categories: Record<string, number>, budget: any) => {
            const categoryName = typeof budget.category === 'object' ? 
              (budget.category as any).name : 'Uncategorized';
            categories[categoryName] = budget.totalSpent;
            return categories;
          }, {})
        },
        savings: { total: 0, categories: {} },
        netIncome: -data.budgets.reduce((sum: number, budget: any) => sum + budget.totalSpent, 0),
        statistics: {
          totalTransactions: data.budgets.reduce((sum: number, budget: any) => sum + budget.transactions.length, 0),
          budgets: {
            total: data.summary.totalBudgets,
            exceeded: data.summary.exceededBudgets,
            onTrack: data.summary.onTrackBudgets
          }
        }
      };
    } else {
      // For other report types, get fresh transaction data
      financialSummary = await prepareFinancialSummaryForEmail(userId, startDate, endDate);
    }
    
    // Send the email
    const emailResult = await sendReportEmail(
      user.name,
      user.email,
      title,
      reportPeriod,
      financialSummary
    );
    
    if (emailResult) {
      // Create notification that report was emailed
      await NotificationGatewayService.createReportEmailedNotification(
        userId,
        title,
        reportPeriod
      );
    }
    
    return emailResult;
  } catch (error) {
    logger.error(`Error sending report by email: ${error}`);
    throw error;
  }
};

/**
 * Helper to extract category totals from report data
 */
const extractCategoriesFromReport = (categorySummary: Record<string, any>): Record<string, number> => {
  const categories: Record<string, number> = {};
  
  Object.entries(categorySummary).forEach(([categoryName, data]: [string, any]) => {
    categories[categoryName] = data.total;
  });
  
  return categories;
};

/**
 * Find the most active day from transaction data
 */
const findMostActiveDay = (transactions: any[]): string => {
  if (!transactions.length) return '';
  
  // Count transactions by date
  const dateCount: Record<string, number> = {};
  transactions.forEach(tx => {
    const date = new Date(tx.date).toISOString().split('T')[0];
    dateCount[date] = (dateCount[date] || 0) + 1;
  });
  
  // Find date with most transactions
  let mostActiveDate = '';
  let highestCount = 0;
  
  Object.entries(dateCount).forEach(([date, count]) => {
    if (count > highestCount) {
      mostActiveDate = date;
      highestCount = count;
    }
  });
  
  // Format the date for display
  if (mostActiveDate) {
    const date = new Date(mostActiveDate);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }
  
  return '';
};

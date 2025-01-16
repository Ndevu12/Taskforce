import Report from '../models/Report';
import Transaction from '../models/Transaction';
import { IReport } from '../types/interfaces/IReport';
import { ITransaction } from '../types/interfaces/ITransaction';
import { getTransactionsSummary } from './TransactionService';
import { ReportType } from '../types/enums/ReportType';
import logger from '../utils/logger';
import mongoose from 'mongoose';
import { ReportData } from '../types/interfaces/ReportData';

export const createReport = async (reportData: IReport) => {
  const report = new Report(reportData);
  await report.save();
  return report;
};

export const getReportsByUser = async (userId: string) => {
  return await Report.find({ user: userId });
};

export const updateReportById = async (reportId: string, updateData: Partial<IReport>) => {
  return await Report.findByIdAndUpdate(reportId, updateData, { new: true });
};

export const deleteReportById = async (reportId: string) => {
  return await Report.findByIdAndDelete(reportId);
};

export const autoGenerateReports = async (userId: mongoose.Schema.Types.ObjectId, scheduleId: mongoose.Schema.Types.ObjectId, period?: string, budgetExceed?: string) => {
  if (!userId) {
    logger.error('User ID is required');
    return { error: 'User ID is required' };
  }

  if (!scheduleId) {
    logger.error('Schedule ID is required');
    return { error: 'Schedule ID is required' };
  }
  
  const transactions = await Transaction.find({ user: userId });
  if (!transactions) {
    logger.error('No transactions found');
    return { error: 'No transactions found' };
  }

  const reportData: ReportData = {
    user: userId,
    totalIncome: 0,
    totalExpense: 0,
    transactions: []
  };

  transactions.forEach(transaction => {
    reportData.transactions.push(transaction);
    if (transaction.type === 'INCOME') {
      reportData.totalIncome += transaction.amount;
    } else if (transaction.type === 'EXPENSE') {
      reportData.totalExpense += transaction.amount;
    }
  });

  const title =  period ? `${period} Financial Report` : budgetExceed ? 'Budget Exceeded Report' : 'Monthly Financial Report';

  const report = await createReport({
    user: userId,
    schedule: scheduleId,
    data: {
      title: title,
      content: `Total Income: ${reportData.totalIncome}, Total Expense: ${reportData.totalExpense}`,
      transactions: reportData.transactions
    }
  } as unknown as IReport);

  return report;
};

import Report from '../models/Report';
import Transaction from '../models/Transaction';
import { IReport } from '../types/interfaces/IReport';
import { ITransaction } from '../types/interfaces/ITransaction';
import { getTransactionsSummary } from './TransactionService';

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

export const autoGenerateReports = async (userId: string) => {
  const transactions = await Transaction.find({ user: userId });

  interface ReportData {
    user: string;
    totalIncome: number;
    totalExpense: number;
    transactions: ITransaction[];
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

  // Create report for the user
  const report = new Report({
    user: reportData.user,
    title: 'Monthly Financial Report',
    content: `Total Income: ${reportData.totalIncome}, Total Expense: ${reportData.totalExpense}`,
    date: new Date()
  });

  // Save the report
  return report.save();
};

export const generateReport = async ({ user, type, startDate, endDate }: any) => {
  const transactionsSummary = await getTransactionsSummary(user);
  const reportData = {
    user,
    type,
    startDate,
    endDate,
    data: transactionsSummary
  };
  const report = new Report(reportData);
  await report.save();
  return report;
};
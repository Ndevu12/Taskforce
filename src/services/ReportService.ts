import Report from '../models/Report';
import { IReport } from '../types/interfaces/IReport';

export const createReport = async (reportData: IReport) => {
  const report = new Report(reportData);
  return await report.save();
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
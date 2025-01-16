import ReportSchedule from '../models/ReportSchedule';
import logger from '../utils/logger';

export const createReportSchedule = async (scheduleData: any) => {
  const schedule = new ReportSchedule(scheduleData);
  await schedule.save();
  return schedule;
};

export const getReportSchedulesByUser = async (userId: string) => {
  return await ReportSchedule.find({ user: userId });
};

export const getReportScheduleById = async (scheduleId: string) => {
  return await ReportSchedule.findById(scheduleId);
};

export const updateReportScheduleById = async (scheduleId: string, updateData: any) => {
  try {
    const schedule = await ReportSchedule.findByIdAndUpdate(scheduleId, updateData, { new: true });
    if (!schedule) {
      throw new Error(`Schedule not found with ID: ${scheduleId}`);
    }
    return schedule;
  } catch (error: any) {
    logger.error(`Failed to update report schedule with ID: ${scheduleId}`, error);
    throw new Error(`Failed to update report schedule: ${error.message}`);
  }
};

export const deleteReportScheduleById = async (scheduleId: string) => {
  return await ReportSchedule.findByIdAndDelete(scheduleId);
};

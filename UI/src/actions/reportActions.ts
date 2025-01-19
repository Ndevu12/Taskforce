import axios from 'axios';
import { IReport, IReportSchedule } from '../interfaces/Report';
import { getAuthHeaders } from './APIHeader';

const API_URL = import.meta.env.VITE_BASE_URL;

if (!API_URL) {
    throw new Error('VITE_BASE_URL is not defined');
}

export const fetchReports = async (): Promise<IReport[]> => {
  const response = await axios.get(`${API_URL}/reports/user`, getAuthHeaders());
  return response.data;
};

export const getReportById = async (reportId: string): Promise<IReport> => {
    const response = await axios.get(`${API_URL}/report/${reportId}`, getAuthHeaders());
    return response.data;
}

// APIs FOR SCHEDULING REPORTS
export const fetchSchedules = async (): Promise<IReportSchedule[]> => {
    const response = await axios.get(`${API_URL}/report/schedule/user`, getAuthHeaders());
    return response.data;
};

export const ScheduleReport = async (scheduleData: IReportSchedule): Promise<IReportSchedule> => {
    console.log('scheduleData', scheduleData);
    const response = await axios.post(`${API_URL}/report/schedule`, {
        type: scheduleData.type,
        title: scheduleData.title,
        startDate: scheduleData.startDate,
        endDate: scheduleData.endDate,
    }, getAuthHeaders());
    return response.data;
}

export const updateSchedule = async (scheduleData: IReportSchedule): Promise<IReportSchedule> => {
    console.log('scheduleData', scheduleData);
    const response = await axios.put(`${API_URL}/report/schedule/${scheduleData.id}`, {
        type: scheduleData.type,
        title: scheduleData.title,
        startDate: scheduleData.startDate,
        endDate: scheduleData.endDate,
    }, getAuthHeaders());
    return response.data;
}

export const deleteSchedule = async (scheduleId: string): Promise<void> => {
    await axios.delete(`${API_URL}/report/schedule/${scheduleId}`, getAuthHeaders());
}

export const getScheduleById = async (scheduleId: string): Promise<IReportSchedule> => {
    const response = await axios.get(`${API_URL}/report/schedule/${scheduleId}`, getAuthHeaders());
    return response.data;
}

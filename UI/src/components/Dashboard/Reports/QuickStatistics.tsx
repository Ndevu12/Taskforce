import React from 'react';
import { IReport } from '../../../interfaces/Report';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface QuickStatisticsProps {
  reports: IReport[];
}

const QuickStatistics: React.FC<QuickStatisticsProps> = ({ reports }) => {
  const totalReports = reports.length;
  const exceededReports = reports.filter(
    (report) => report.schedule.name === 'EXCEEDED',
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="p-4 bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 shadow rounded">
        <h3 className="text-lg font-bold">Total Reports</h3>
        <p className="text-2xl">
          {totalReports !== undefined ? totalReports : <Skeleton />}
        </p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 text-red-800 dark:text-red-300 shadow rounded">
        <h2 className="text-lg sm:text-l font-bold">Budget Exceeded Reports</h2>
        <p className="text-2xl">
          {exceededReports !== undefined ? exceededReports : <Skeleton />}
        </p>
      </div>
    </div>
  );
};

export default QuickStatistics;

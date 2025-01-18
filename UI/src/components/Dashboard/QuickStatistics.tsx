import React from 'react';
import { IReport } from '../../interfaces/Report';

interface QuickStatisticsProps {
  reports: IReport[];
}

const QuickStatistics: React.FC<QuickStatisticsProps> = ({ reports }) => {
  const totalReports = reports.length;
  const exceededReports = reports.filter(
    (report) => report.status === 'Failed',
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="p-4 bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 shadow rounded">
        <h3 className="text-lg font-bold">Total Reports</h3>
        <p className="text-2xl">{totalReports}</p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 text-red-800 dark:text-red-300 shadow rounded">
        <h2 className="text-lg font-bold">Budget Exceeded Reports</h2>
        <p className="text-2xl">{exceededReports}</p>
      </div>
    </div>
  );
};

export default QuickStatistics;

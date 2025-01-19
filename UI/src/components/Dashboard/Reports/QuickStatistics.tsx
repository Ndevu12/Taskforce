import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface QuickStatisticsProps {
  totalReports: number;
  exceededReports: number;
}

const QuickStatistics: React.FC<QuickStatisticsProps> = ({
  totalReports,
  exceededReports,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="p-6 bg-gradient-to-r dark:from-green from-green-300 dark:to-green-900 to-green-400 text-white shadow-lg rounded-lg flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold">Total Reports</h3>
        <p className="text-3xl mt-2">
          {totalReports !== undefined ? totalReports : <Skeleton />}
        </p>
      </div>
      <div className="p-6 bg-gradient-to-r from-red-300 dark:from-red-700 dark:to-red-900 to-red-400 text-white shadow-lg rounded-lg flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold">Budget Exceeded Reports</h3>
        <p className="text-3xl mt-2">
          {exceededReports !== undefined ? exceededReports : <Skeleton />}
        </p>
      </div>
    </div>
  );
};

export default QuickStatistics;

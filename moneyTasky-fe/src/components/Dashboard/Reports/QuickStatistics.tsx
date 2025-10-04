import React from 'react';
import { IReportAnalytics } from '../../../types/interfaces/Report';
import formatMoney from '../../../utils/formatMoney';

interface QuickStatisticsProps {
  analytics: IReportAnalytics | null;
  isLoading?: boolean;
}

const QuickStatistics: React.FC<QuickStatisticsProps> = ({
  analytics,
  isLoading = false,
}) => {
  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-r from-blue-300 dark:from-blue-700 dark:to-blue-900 to-blue-400 text-white shadow-lg rounded-lg">
          <h3 className="text-lg font-bold">Total Reports</h3>
          <div className="text-3xl mt-2">
            <div className="h-8 bg-blue-200 dark:bg-blue-800 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6 bg-gradient-to-r from-green-300 dark:from-green-700 dark:to-green-900 to-green-400 text-white shadow-lg rounded-lg">
          <h3 className="text-lg font-bold">Monthly Income</h3>
          <div className="text-3xl mt-2">
            <div className="h-8 bg-green-200 dark:bg-green-800 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6 bg-gradient-to-r from-red-300 dark:from-red-700 dark:to-red-900 to-red-400 text-white shadow-lg rounded-lg">
          <h3 className="text-lg font-bold">Monthly Expenses</h3>
          <div className="text-3xl mt-2">
            <div className="h-8 bg-red-200 dark:bg-red-800 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6 bg-gradient-to-r from-purple-300 dark:from-purple-700 dark:to-purple-900 to-purple-400 text-white shadow-lg rounded-lg">
          <h3 className="text-lg font-bold">Report Types</h3>
          <div className="text-3xl mt-2">
            <div className="h-8 bg-purple-200 dark:bg-purple-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="p-6 bg-gradient-to-r from-blue-300 dark:from-blue-700 dark:to-blue-900 to-blue-400 text-white shadow-lg rounded-lg">
        <h3 className="text-lg font-bold">Total Reports</h3>
        <p className="text-3xl mt-2">{analytics.totalReports}</p>
        <p className="text-sm mt-2">
          {analytics.periodSummary.thisMonth.count} this month
        </p>
      </div>

      <div className="p-6 bg-gradient-to-r from-green-300 dark:from-green-700 dark:to-green-900 to-green-400 text-white shadow-lg rounded-lg">
        <h3 className="text-lg font-bold">Monthly Income</h3>
        <p className="text-3xl mt-2">
          {formatMoney(analytics.periodSummary.thisMonth.incomeTotal)}
        </p>
        <div className="text-sm mt-2 flex items-center">
          {analytics.periodSummary.percentChange.incomeTotal > 0 ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span className="ml-1">
                {Math.abs(
                  analytics.periodSummary.percentChange.incomeTotal,
                ).toFixed(1)}
                % from last month
              </span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <span className="ml-1">
                {Math.abs(
                  analytics.periodSummary.percentChange.incomeTotal,
                ).toFixed(1)}
                % from last month
              </span>
            </>
          )}
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-red-300 dark:from-red-700 dark:to-red-900 to-red-400 text-white shadow-lg rounded-lg">
        <h3 className="text-lg font-bold">Monthly Expenses</h3>
        <p className="text-3xl mt-2">
          {formatMoney(analytics.periodSummary.thisMonth.expenseTotal)}
        </p>
        <div className="text-sm mt-2 flex items-center">
          {analytics.periodSummary.percentChange.expenseTotal < 0 ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span className="ml-1">
                {Math.abs(
                  analytics.periodSummary.percentChange.expenseTotal,
                ).toFixed(1)}
                % less than last month
              </span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <span className="ml-1">
                {Math.abs(
                  analytics.periodSummary.percentChange.expenseTotal,
                ).toFixed(1)}
                % more than last month
              </span>
            </>
          )}
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-purple-300 dark:from-purple-700 dark:to-purple-900 to-purple-400 text-white shadow-lg rounded-lg">
        <h3 className="text-lg font-bold">Report Types</h3>
        <p className="text-lg mt-2">
          {Object.entries(analytics.reportsByType).map(([type, count]) => (
            <span key={type} className="flex justify-between">
              <span>{type.replace(/_/g, ' ')}:</span>
              <span>{count}</span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default QuickStatistics;

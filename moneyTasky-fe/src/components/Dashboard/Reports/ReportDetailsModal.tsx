import React from 'react';
import { IReport, ReportType } from '../../../types/interfaces/Report';
import formatMoney from '../../../utils/formatMoney';

interface ReportDetailsModalProps {
  report: IReport | null;
  onClose: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  onClose,
}) => {
  if (!report) return null;

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const renderTransactionSummary = () => {
    const data = report.data;
    if (!data?.summary) return <p>No summary data available</p>;

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <h4 className="font-semibold text-lg">Transaction Count</h4>
            <p className="text-2xl">{data.summary.totalTransactions}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-800 p-4 rounded">
            <h4 className="font-semibold text-lg">Total Income</h4>
            <p className="text-2xl text-green-600 dark:text-green-300">
              {formatMoney(data.summary.byType.INCOME?.total || 0)}
            </p>
          </div>
          <div className="bg-red-100 dark:bg-red-800 p-4 rounded">
            <h4 className="font-semibold text-lg">Total Expense</h4>
            <p className="text-2xl text-red-600 dark:text-red-300">
              {formatMoney(data.summary.byType.EXPENSE?.total || 0)}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-6 mb-4">Category Breakdown</h3>
        {data.categorySummary &&
          Object.entries(data.categorySummary).map(
            ([type, categories]: [string, any]) => (
              <div key={type} className="mb-6">
                <h4 className="text-lg font-semibold mb-2">{type}</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2 text-right">Amount</th>
                        <th className="p-2 text-right">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(categories).map(
                        ([category, data]: [string, any]) => (
                          <tr
                            key={category}
                            className="border-b dark:border-gray-700"
                          >
                            <td className="p-2">{category}</td>
                            <td className="p-2 text-right">
                              {formatMoney(data.total)}
                            </td>
                            <td className="p-2 text-right">{data.count}</td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          )}
      </div>
    );
  };

  const renderBudgetPerformance = () => {
    const data = report.data;
    if (!data?.budgets) return <p>No budget data available</p>;

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <h4 className="font-semibold text-lg">Total Budgets</h4>
            <p className="text-2xl">{data.summary.totalBudgets}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-800 p-4 rounded">
            <h4 className="font-semibold text-lg">On Track</h4>
            <p className="text-2xl text-green-600 dark:text-green-300">
              {data.summary.onTrackBudgets}
            </p>
          </div>
          <div className="bg-red-100 dark:bg-red-800 p-4 rounded">
            <h4 className="font-semibold text-lg">Exceeded</h4>
            <p className="text-2xl text-red-600 dark:text-red-300">
              {data.summary.exceededBudgets}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-6 mb-4">Budget Details</h3>
        <div className="space-y-4">
          {data.budgets.map((budget: any) => (
            <div
              key={budget.id}
              className="border dark:border-gray-700 p-4 rounded"
            >
              <h4 className="font-semibold text-lg">{budget.description}</h4>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Allocated:
                  </span>
                  <span className="ml-2">{formatMoney(budget.amount)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Spent:
                  </span>
                  <span className="ml-2">{formatMoney(budget.totalSpent)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Used:
                  </span>
                  <span className="ml-2">{budget.percentUsed.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`ml-2 ${budget.isExceeded ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {budget.isExceeded ? 'Exceeded' : 'On Track'}
                  </span>
                </div>
              </div>

              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`h-2.5 rounded-full ${
                    budget.isExceeded
                      ? 'bg-red-600'
                      : budget.percentUsed > 80
                        ? 'bg-yellow-400'
                        : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(100, budget.percentUsed)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (report.type) {
      case ReportType.TRANSACTION_SUMMARY:
        return renderTransactionSummary();
      case ReportType.BUDGET_PERFORMANCE:
        return renderBudgetPerformance();
      default:
        return <p>No visualization available for this report type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">{report.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Close"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              {report.type.replace(/_/g, ' ')}
            </div>
            <div>
              <span className="font-medium">Date Range:</span>{' '}
              {formatDate(report.dateRange.startDate)} to{' '}
              {formatDate(report.dateRange.endDate)}
            </div>
            <div>
              <span className="font-medium">Created:</span>{' '}
              {formatDate(report.createdAt)}
            </div>
          </div>

          {report.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {report.description}
              </p>
            </div>
          )}

          {renderReportContent()}
        </div>

        <div className="border-t dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;

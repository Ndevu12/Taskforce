import React from 'react';
import { IReportSummary } from '../../../interfaces/Report';

interface ReportDetailsModalProps {
  report: IReportSummary;
  onClose: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">
          Report Details
        </h2>
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
          {report.title}
        </h3>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <strong>Created At:</strong> {new Date(report.createdAt).toLocaleDateString()}
        </p>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <strong>Total Transactions:</strong> {report.totalTransactions}
        </p>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <strong>Total Income:</strong> {report.totalIncome}
        </p>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <strong>Total Expense:</strong> {report.totalExpense}
        </p>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <strong>Schedule Type:</strong> {report.scheduleType}
        </p>
        <button
          className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReportDetailsModal;

import React from 'react';
import { IReport } from '../../interfaces/Report';

interface ReportDetailsModalProps {
  report: IReport;
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
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-gray-700 dark:text-gray-300">
          {JSON.stringify(report.data, null, 2)}
        </pre>
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

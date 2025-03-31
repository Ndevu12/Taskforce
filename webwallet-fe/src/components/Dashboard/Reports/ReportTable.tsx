import React, { useState } from 'react';
import Pagination from '../../common/Pagination';
import { IReportSummary, ReportType } from '../../../types/interfaces/Report';
import formatMoney from '../../../utils/formatMoney';

interface ReportTableProps {
  reports: IReportSummary[];
  onView: (report: IReportSummary) => void;
  onDelete: (reportId: string) => void;
  isLoading?: boolean;
}

const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  onView,
  onDelete,
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');

  // Filter reports based on search and filter
  const filteredReports = reports.filter((report) => {
    return (
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType ? report.type === filterType : true)
    );
  });

  // Pagination
  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport,
  );

  // Format report type for display
  const formatReportType = (type: string): string => {
    return type.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="mt-7 border border-gray-300 rounded p-4 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-7 border border-gray-300 rounded p-4 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by title"
          className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor="typeFilter" className="sr-only">
          Filter by type
        </label>
        <select
          id="typeFilter"
          className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {Object.values(ReportType).map((type) => (
            <option key={type} value={type}>
              {formatReportType(type)}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Title
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Type
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Date Range
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Transactions
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Income/Expense
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Created
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No available reports. Generate a report to get started!
                </td>
              </tr>
            ) : (
              currentReports.map((report) => (
                <tr
                  key={report._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => onView(report)}
                >
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {report.title}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      {formatReportType(report.type)}
                    </span>
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {formatDate(report.dateRange.startDate.toString())} -{' '}
                    {formatDate(report.dateRange.endDate.toString())}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {report.summary?.transactionCount || 0}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <div>
                      <span className="text-green-600 dark:text-green-400">
                        {formatMoney(report.summary?.totalIncome || 0)}
                      </span>
                      <span className="mx-1">/</span>
                      <span className="text-red-600 dark:text-red-400">
                        {formatMoney(report.summary?.totalExpense || 0)}
                      </span>
                    </div>
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <button
                      className="text-red-500 dark:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(report._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filteredReports.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredReports.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
};

export default ReportTable;

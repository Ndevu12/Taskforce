import React, { useState, useEffect } from 'react';
import Pagination from '../../common/Pagination';
import { IReportSummary } from '../../../interfaces/Report';
import { BudgetPeriod } from '../../../interfaces/Budget';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ReportTableProps {
  reports: IReportSummary[];
  onView: (report: IReportSummary) => void;
  onDelete: (report: IReportSummary) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  onView,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchedule, setFilterSchedule] = useState<BudgetPeriod | ''>('');
  const [filteredReports, setFilteredReports] =
    useState<IReportSummary[]>(reports);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filtered = reports.filter((report) => {
      return (
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterSchedule ? report.scheduleType === filterSchedule : true)
      );
    });
    setFilteredReports(filtered);
    setLoading(false);
  }, [searchTerm, filterSchedule, reports]);

  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport,
  );

  return (
    <div className="mt-7 border border-gray-300 rounded p-4 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <input
          type="text"
          placeholder="Search by title"
          className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor="scheduleFilter" className="sr-only">
          Filter by schedule
        </label>
        <select
          id="scheduleFilter"
          className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
          value={filterSchedule}
          onChange={(e) => setFilterSchedule(e.target.value as BudgetPeriod)}
        >
          <option value="">All Schedules</option>
          {Object.values(BudgetPeriod).map((period) => (
            <option
              className="text-sm sm:text-base"
              key={period}
              value={period}
            >
              {period}
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
                Created At
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Total Transactions
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Total Income
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Total Expense
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Schedule Type
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <tr key={index}>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <Skeleton />
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <Skeleton />
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <Skeleton />
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <Skeleton />
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <Skeleton />
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <Skeleton />
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <Skeleton />
                  </td>
                </tr>
              ))
            ) : currentReports.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No available report at the moment!
                </td>
              </tr>
            ) : (
              currentReports.map((report) => (
                <tr
                  key={report._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {report.title}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {report.totalTransactions}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {report.totalIncome}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {report.totalExpense}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {report.scheduleType}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <button
                      className="text-blue-500 dark:text-blue-300 mr-2"
                      onClick={() => onView(report)}
                    >
                      Details
                    </button>
                    <button
                      className="text-red-500 dark:text-red-300"
                      onClick={() => onDelete(report)}
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
      <Pagination
        currentPage={currentPage}
        totalItems={filteredReports.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default ReportTable;

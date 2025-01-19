import React, { useState, useEffect } from 'react';
import Pagination from '../../common/Pagination';
import { IReport } from '../../../interfaces/Report';
import { BudgetPeriod } from '../../../interfaces/Budget';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ReportTableProps {
  reports: IReport[];
  onView: (report: IReport) => void;
  onDelete: (report: IReport) => void;
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
  const [filteredReports, setFilteredReports] = useState<IReport[]>(reports);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filtered = reports.filter((report) => {
      return (
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterSchedule ? report.schedule === filterSchedule : true)
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
      <div className="flex justify-between mb-4">
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
            <option key={period} value={period}>
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
                Schedule
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
                </tr>
              ))
            ) : currentReports.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No available report at the moment!
                </td>
              </tr>
            ) : (
              currentReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {report.title}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {report.schedule}
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

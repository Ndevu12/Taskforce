import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import { IReport } from '../../interfaces/Report';

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
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredReports, setFilteredReports] = useState<IReport[]>(reports);

  useEffect(() => {
    const filtered = reports.filter((report) => {
      return (
        report.schedule.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus ? report.status === filterStatus : true)
      );
    });
    setFilteredReports(filtered);
  }, [searchTerm, filterStatus, reports]);

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
          placeholder="Search by schedule"
          className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor="statusFilter" className="sr-only">
          Filter by status
        </label>
        <select
          id="statusFilter"
          className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Schedule
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Status
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                  {report.schedule}
                </td>
                <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                  <span
                    className={`px-2 py-1 rounded ${
                      report.status === 'Completed'
                        ? 'bg-green-200 dark:bg-green-700'
                        : 'bg-red-200 dark:bg-red-700'
                    }`}
                  >
                    {report.status}
                  </span>
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
            ))}
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

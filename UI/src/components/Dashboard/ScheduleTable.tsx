import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import { IReportSchedule } from '../../interfaces/Report';

interface ScheduleTableProps {
  schedules: IReportSchedule[];
  onView: (schedule: IReportSchedule) => void;
  onDelete: (schedule: IReportSchedule) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  onView,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchedules, setFilteredSchedules] =
    useState<IReportSchedule[]>(schedules);

  useEffect(() => {
    const filtered = schedules.filter((schedule) => {
      return schedule.type.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredSchedules(filtered);
  }, [searchTerm, schedules]);

  const indexOfLastSchedule = currentPage * itemsPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(
    indexOfFirstSchedule,
    indexOfLastSchedule,
  );

  return (
    <div className="mt-7 border border-gray-300 dark:border-gray-700 rounded p-4 dark:bg-gray-800">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by type"
          className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b dark:border-gray-700">Type</th>
              <th className="py-2 px-4 border-b dark:border-gray-700">
                Start Date
              </th>
              <th className="py-2 px-4 border-b dark:border-gray-700">
                End Date
              </th>
              <th className="py-2 px-4 border-b dark:border-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSchedules.map((schedule) => (
              <tr
                key={schedule.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  {schedule.type}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  {schedule.startDate?.toISOString().split('T')[0]}
                </td>
                <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                  {schedule.endDate?.toISOString().split('T')[0]}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => onView(schedule)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-300"
                    onClick={() => onDelete(schedule)}
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
        totalItems={filteredSchedules.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default ScheduleTable;

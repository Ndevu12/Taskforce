import React, { useState } from 'react';
import { IReportSchedule } from '../../../interfaces/Report';
import { BudgetPeriod } from '../../../interfaces/Budget';

interface ScheduleFormModalProps {
  schedule: IReportSchedule | null;
  onClose: () => void;
  onSave: (schedule: IReportSchedule) => void;
}

const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({
  schedule,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState<string>(schedule?.title || '');
  const [type, setType] = useState<BudgetPeriod>(
    () => schedule?.type || BudgetPeriod.DAILY,
  );
  const [startDate, setStartDate] = useState<string>(
    schedule?.startDate
      ? new Date(schedule.startDate).toISOString().split('T')[0]
      : '',
  );
  const [endDate, setEndDate] = useState<string>(
    schedule?.endDate
      ? new Date(schedule.endDate).toISOString().split('T')[0]
      : '',
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = 'Title is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (new Date(startDate) >= new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave({
      id: schedule?._id || '',
      title,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">
          {schedule ? 'Edit Schedule' : 'Create Schedule'}
        </h2>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded w-full dark:bg-gray-700 dark:text-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            title="Title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-gray-700 dark:text-gray-300"
            htmlFor="type-select"
          >
            Type
          </label>
          <select
            id="type-select"
            className="p-2 border border-gray-300 rounded w-full dark:bg-gray-700 dark:text-gray-300"
            value={type}
            onChange={(e) => setType(e.target.value as BudgetPeriod)}
          >
            {Object.values(BudgetPeriod)
              .filter((period) => period !== 'EXCEEDED')
              .map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded w-full dark:bg-gray-700 dark:text-gray-300"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Select start date"
            title="Start Date"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded w-full dark:bg-gray-700 dark:text-gray-300"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            title="End Date"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate}</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white p-2 rounded-lg mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFormModal;

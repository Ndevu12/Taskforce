import React from 'react';
import { BudgetResponse } from '../../../types/interfaces/Budget';
import formatMoney from '../../../utils/formatMoney';
import BudgetProgressBar from './BudgetProgressBar';

interface BudgetDetailModalProps {
  budget: BudgetResponse | null;
  onClose: () => void;
}

const BudgetDetailModal: React.FC<BudgetDetailModalProps> = ({
  budget,
  onClose,
}) => {
  if (!budget) return null;

  // Format date function
  const formatDate = (dateString: Date) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Invalid date:', error);
      return 'Invalid date';
    }
  };

  // Calculate stats
  const usagePercentage =
    budget.amount > 0
      ? Math.min(100, (budget.currentSpent / budget.amount) * 100)
      : 0;

  const remaining = Math.max(0, budget.amount - budget.currentSpent);
  const isExceeded = budget.currentSpent > budget.amount;

  const daysLeft = budget.endDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(budget.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const getStatusColor = () => {
    if (isExceeded) return 'text-red-600 dark:text-red-400';
    if (usagePercentage >= (budget.notificationThreshold || 80))
      return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getStatusText = () => {
    if (isExceeded) return 'EXCEEDED';
    if (usagePercentage >= (budget.notificationThreshold || 80))
      return 'APPROACHING LIMIT';
    return 'ON TRACK';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-2xl m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            Budget Details
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor()} bg-opacity-20 dark:bg-opacity-20`}
          >
            {getStatusText()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Basic Information
            </h3>
            <p className="mb-2">
              <span className="font-semibold">Description:</span>{' '}
              {budget.description || 'N/A'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Category:</span>{' '}
              {budget.category?.name || 'Uncategorized'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Period:</span> {budget.period}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              {budget.isActive ? 'Active' : 'Inactive'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Alert Threshold:</span>{' '}
              {budget.notificationThreshold || 80}%
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Time Period
            </h3>
            <p className="mb-2">
              <span className="font-semibold">Start Date:</span>{' '}
              {formatDate(budget.startDate)}
            </p>
            <p className="mb-2">
              <span className="font-semibold">End Date:</span>{' '}
              {formatDate(budget.endDate)}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Days Remaining:</span> {daysLeft}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Created:</span>{' '}
              {formatDate(budget.createdAt as any)}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Last Updated:</span>{' '}
              {formatDate(budget.updatedAt as any)}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Financial Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                Allocated
              </p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                {formatMoney(budget.amount)}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">Spent</p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {formatMoney(budget.currentSpent)}
              </p>
            </div>
            <div
              className={`${isExceeded ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'} p-3 rounded-lg`}
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Remaining
              </p>
              <p
                className={`text-xl font-bold ${isExceeded ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {isExceeded ? '-' : ''}
                {formatMoney(
                  isExceeded ? budget.currentSpent - budget.amount : remaining,
                )}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Progress</span>
              <span>{usagePercentage.toFixed(1)}%</span>
            </div>
            <BudgetProgressBar value={usagePercentage} />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="p-2 bg-blue-500 text-white rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetDetailModal;

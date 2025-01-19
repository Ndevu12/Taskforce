import React from 'react';
import { Budget } from '../../../interfaces/Budget';

interface BudgetDetailModalProps {
  budget: Budget | null;
  onClose: () => void;
}

const BudgetDetailModal: React.FC<BudgetDetailModalProps> = ({
  budget,
  onClose,
}) => {
  if (!budget) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">
          Budget Details
        </h2>
        <p>
          <strong>Category:</strong> {budget.category?.name}
        </p>
        <p>
          <strong>Amount Allocated:</strong> ${budget.amount}
        </p>
        <p>
          <strong>Current Spent:</strong> ${budget.currentSpent}
        </p>
        <p>
          <strong>Period:</strong> {budget.period}
        </p>
        <p>
          <strong>Start Date:</strong>{' '}
          {new Date(budget.startDate).toDateString()}
        </p>
        <p>
          <strong>End Date:</strong> {new Date(budget.endDate).toDateString()}
        </p>
        {budget.description && (
          <p>
            <strong>Description:</strong> {budget.description}
          </p>
        )}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="p-2 bg-gray-300 rounded"
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

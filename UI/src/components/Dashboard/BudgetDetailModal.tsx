import React from 'react';
import { Budget } from '../../interfaces/Budget';

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
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Budget Details</h2>
        <p>
          <strong>Name:</strong> {budget.name}
        </p>
        <p>
          <strong>Category:</strong> {budget.category}
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
          <strong>Start Date:</strong> {budget.startDate.toDateString()}
        </p>
        <p>
          <strong>End Date:</strong> {budget.endDate.toDateString()}
        </p>
        <p>
          <strong>Notification Threshold:</strong>{' '}
          {budget.notificationThreshold}%
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

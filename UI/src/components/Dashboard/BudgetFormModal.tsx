import React, { useState, useEffect } from 'react';
import { Budget, BudgetPeriod } from '../../interfaces/Budget';

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Budget) => void;
  budgetToEdit?: Budget | null;
}

const BudgetFormModal: React.FC<BudgetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  budgetToEdit,
}) => {
  const [budget, setBudget] = useState<Budget>({
    id: 0,
    name: '',
    category: '',
    amount: 0,
    period: BudgetPeriod.MONTHLY,
    startDate: new Date(),
    endDate: new Date(),
    currentSpent: 0,
    notificationThreshold: 80,
    description: '',
  });

  useEffect(() => {
    if (budgetToEdit) {
      setBudget(budgetToEdit);
    }
  }, [budgetToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setBudget((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(budget);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-xl mb-4">
          {budgetToEdit ? 'Edit Budget' : 'Add Budget'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block mb-1">Budget Name</label>
              <input
                type="text"
                name="name"
                value={budget.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter budget name"
                title="Budget Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={budget.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter category"
                title="Category"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Amount Allocated</label>
              <input
                type="number"
                name="amount"
                value={budget.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                min="0"
                title="Amount Allocated"
                placeholder="Enter amount allocated"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Period</label>
              <select
                name="period"
                value={budget.period}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                title="Period"
              >
                {Object.values(BudgetPeriod).map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={budget.startDate.toISOString().split('T')[0]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                title="Start Date"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={budget.endDate.toISOString().split('T')[0]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                title="End Date"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Current Spent</label>
              <input
                type="number"
                name="currentSpent"
                value={budget.currentSpent}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                min="0"
                title="Current Spent"
                placeholder="Enter current spent amount"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Notification Threshold (%)</label>
              <input
                type="number"
                name="notificationThreshold"
                value={budget.notificationThreshold}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                min="0"
                max="100"
                title="Notification Threshold"
                placeholder="Enter notification threshold"
              />
            </div>
            <div className="mb-4 sm:col-span-3">
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={budget.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter description (optional)"
                title="Description"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 p-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetFormModal;

import React, { useState, useEffect } from 'react';
import {
  Budget,
  BudgetPeriod,
  BudgetResponse,
} from '../../../interfaces/Budget';

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: BudgetResponse) => void;
  budgetToEdit?: BudgetResponse | null;
  categories: { name: string; _id: string }[];
}

const BudgetFormModal: React.FC<BudgetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  budgetToEdit,
  categories,
}) => {
  const [budget, setBudget] = useState<Budget>({
    id: '',
    category: '',
    amount: 0,
    period: BudgetPeriod.MONTHLY,
    startDate: new Date(),
    endDate: new Date(),
    currentSpent: 0,
    description: '',
  });

  useEffect(() => {
    if (budgetToEdit) {
      try {
        setBudget({
          id: budgetToEdit._id,
          category: budgetToEdit.category._id,
          amount: budgetToEdit.amount,
          period: budgetToEdit.period,
          startDate: new Date(budgetToEdit.startDate),
          endDate: new Date(budgetToEdit.endDate),
          currentSpent: budgetToEdit.currentSpent,
          description: budgetToEdit.description || '',
        });
      } catch (error) {
        console.error('Invalid date format in budgetToEdit:', error);
      }
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
    try {
      const categoryObject = categories.find(
        (cat) => cat._id === budget.category,
      );
      if (!categoryObject) {
        throw new Error('Invalid category');
      }

      const updatedBudget: BudgetResponse = {
        ...budget,
        _id: budget.id,
        category: {
          _id: categoryObject._id,
          name: categoryObject.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
      };
      onSave(updatedBudget);
      onClose();
      alert('Budget saved successfully');
    } catch (error) {
      console.error('Error converting dates:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-xl mb-4 text-gray-700 dark:text-gray-300">
          {budgetToEdit ? 'Edit Budget' : 'Add Budget'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={budget.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                required
                title="Category"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Amount Allocated
              </label>
              <input
                type="number"
                name="amount"
                value={budget.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                required
                min="0"
                title="Amount Allocated"
                placeholder="Enter amount allocated"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Period <span className="text-red-500">*</span>
              </label>
              <select
                name="period"
                value={budget.period}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
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
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={(() => {
                  try {
                    return new Date(budget.startDate)
                      .toISOString()
                      .split('T')[0];
                  } catch (error) {
                    console.error('Invalid start date:', error);
                    return '';
                  }
                })()}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                required
                title="Start Date"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={(() => {
                  try {
                    return new Date(budget.endDate).toISOString().split('T')[0];
                  } catch (error) {
                    console.error('Invalid end date:', error);
                    return '';
                  }
                })()}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                required
                title="End Date"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Current Spent <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="currentSpent"
                value={budget.currentSpent}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                required
                min="0"
                title="Current Spent"
                placeholder="Enter current spent amount"
              />
            </div>
            <div className="mb-4 sm:col-span-3">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={budget.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                placeholder="Enter description"
                title="Description"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 p-2 bg-gray-300 rounded dark:bg-gray-700 dark:text-white"
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

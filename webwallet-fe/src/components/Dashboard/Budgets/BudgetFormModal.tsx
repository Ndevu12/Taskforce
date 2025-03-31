import React, { useState, useEffect } from 'react';
import {
  Budget,
  BudgetPeriod,
  BudgetResponse,
} from '../../../types/interfaces/Budget';

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: BudgetResponse) => void;
  budgetToEdit?: BudgetResponse | null;
  categories: { name: string; _id: string }[];
  error?: string | null;
}

const BudgetFormModal: React.FC<BudgetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  budgetToEdit,
  categories,
  error,
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (budgetToEdit) {
      console.log('Setting form data for budget:', budgetToEdit);
      try {
        // Handle null category case
        let categoryId = '';
        if (budgetToEdit.category) {
          categoryId = budgetToEdit.category._id;
        } else {
          // Set to empty or first category if available
          categoryId = categories.length > 0 ? categories[0]._id : '';
        }

        setBudget({
          id: budgetToEdit._id,
          category: categoryId,
          amount: budgetToEdit.amount,
          period: budgetToEdit.period,
          startDate: new Date(budgetToEdit.startDate),
          endDate: new Date(budgetToEdit.endDate),
          currentSpent: budgetToEdit.currentSpent,
          description: budgetToEdit.description || '',
          notificationThreshold: budgetToEdit.notificationThreshold || 80,
        });
      } catch (error) {
        console.error('Error setting budget data:', error);
        setGeneralError('Failed to load budget data properly');
      }
    } else {
      // Initialize with default values
      setBudget({
        id: '',
        category: categories.length > 0 ? categories[0]._id : '',
        amount: 0,
        period: BudgetPeriod.MONTHLY,
        startDate: new Date(),
        endDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0,
        ), // End of current month
        currentSpent: 0,
        description: '',
        notificationThreshold: 80,
      });
    }

    // Set error if provided from parent
    if (error) {
      setGeneralError(error);
    }
  }, [budgetToEdit, categories, error]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Clear any errors when user makes changes
    if (generalError) {
      setGeneralError(null);
    }

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Handle numeric values appropriately
    if (
      name === 'amount' ||
      name === 'currentSpent' ||
      name === 'notificationThreshold'
    ) {
      setBudget((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'startDate' || name === 'endDate') {
      setBudget((prev) => ({ ...prev, [name]: new Date(value) }));
    } else {
      setBudget((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!budget.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (budget.amount <= 0) {
      errors.amount = 'Amount must be greater than zero';
    }

    if (budget.startDate >= budget.endDate) {
      errors.endDate = 'End date must be after start date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Find category object (if category is selected)
      const categoryObject = budget.category
        ? categories.find((cat) => cat._id === budget.category)
        : null;

      // Prepare category data for API, handling null case
      const categoryData = categoryObject
        ? {
            _id: categoryObject._id,
            name: categoryObject.name,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        : null;

      const updatedBudget: BudgetResponse = {
        _id: budget.id,
        category: categoryData as any,
        amount: Number(budget.amount),
        period: budget.period,
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
        currentSpent: Number(budget.currentSpent),
        description: budget.description,
        notificationThreshold: budget.notificationThreshold,
      };

      console.log('Submitting budget with data:', updatedBudget);
      onSave(updatedBudget);
    } catch (error: any) {
      console.error('Error preparing budget data:', error);
      setGeneralError(error.message || 'Failed to save budget');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-4xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl mb-4 text-gray-700 dark:text-gray-300">
          {budgetToEdit ? 'Edit Budget' : 'Add Budget'}
        </h2>

        {/* Display any general errors */}
        {generalError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Category{' '}
                {categories.length > 0 && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <select
                name="category"
                value={budget.category || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                title="Category"
              >
                {categories.length > 0 ? (
                  <>
                    <option value="">-- Select Category --</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Amount Allocated <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={budget.amount}
                onChange={handleChange}
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300 ${
                  formErrors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                min="0"
                step="0.01"
                title="Amount Allocated"
                placeholder="Enter amount allocated"
              />
              {formErrors.amount && (
                <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
              )}
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
                    return new Date().toISOString().split('T')[0];
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
                    return new Date().toISOString().split('T')[0];
                  }
                })()}
                onChange={handleChange}
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300 ${
                  formErrors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                title="End Date"
              />
              {formErrors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.endDate}
                </p>
              )}
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
                step="0.01"
                title="Current Spent"
                placeholder="Enter current spent amount"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Notification Threshold (%){' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="notificationThreshold"
                value={budget.notificationThreshold || 80}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                min="0"
                max="100"
                title="Notification Threshold"
                placeholder="Enter threshold percentage (0-100)"
              />
            </div>

            <div className="mb-4 sm:col-span-3">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={budget.description || ''}
                onChange={handleChange}
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300 ${
                  formErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter description"
                title="Description"
                required
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.description}
                </p>
              )}
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

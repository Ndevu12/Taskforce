import React, { useState, useEffect } from 'react';
import BudgetTable from '../../components/Dashboard/Budgets/BudgetTable';
import BudgetFormModal from '../../components/Dashboard/Budgets/BudgetFormModal';
import ConfirmDeleteModal from '../../components/pop-ups/ConfirmDeleteModal';
import { BudgetResponse } from '../../types/interfaces/Budget';
import {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../../actions/budgetActions';
import { fetchCategories } from '../../actions/categoryActions';
import formatMoney from '../../utils/formatMoney';

// Add notification type
type NotificationType = 'success' | 'error' | 'info';

// Add notification interface
interface Notification {
  message: string;
  type: NotificationType;
  id: number;
}

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [categories, setCategories] = useState<{ name: string; _id: string }[]>(
    [],
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<BudgetResponse | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  // Add state for notifications and loading
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  // Function to add a notification
  const addNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, id }]);

    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id),
      );
    }, 5000);
  };

  // Function to dismiss a notification
  const dismissNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  // Function to refresh budgets data
  const refreshBudgets = async () => {
    setIsLoading(true);
    try {
      const fetchedBudgets = await fetchBudgets();
      setBudgets(fetchedBudgets.reverse());
      addNotification('Budgets refreshed successfully', 'success');
    } catch (error: any) {
      addNotification(error.message || 'Failed to refresh budgets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load budgets
        const fetchedBudgets = await fetchBudgets();
        setBudgets(fetchedBudgets.reverse());

        // Load categories
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error: any) {
        addNotification(error.message || 'Failed to load data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [refreshCounter]);

  const handleAddBudget = () => {
    setBudgetToEdit(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleEditBudget = (budget: BudgetResponse) => {
    setBudgetToEdit(budget);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteBudget = (budgetId: string) => {
    setBudgetToDelete(budgetId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBudget = async (budget: BudgetResponse) => {
    try {
      setFormError(null);

      if (budgetToEdit) {
        const updatedBudget = await updateBudget(budget);

        setBudgets((prev) =>
          prev.map((b) => (b._id === updatedBudget._id ? updatedBudget : b)),
        );

        addNotification('Budget updated successfully', 'success');
      } else {
        const newBudget = await createBudget(budget);
        setBudgets((prev) => [newBudget, ...prev]);
        addNotification('Budget created successfully', 'success');
      }

      setIsFormModalOpen(false);

      // Force a refresh to ensure we have the latest data
      setTimeout(() => refreshBudgets(), 500);
    } catch (error: any) {
      console.error('Budget save error:', error);
      setFormError(error.message || 'Failed to save budget');
      // Don't close modal on error
    }
  };

  const handleConfirmDelete = async () => {
    if (budgetToDelete !== null) {
      setIsDeleting(true);
      try {
        await deleteBudget(budgetToDelete);
        setBudgets((prev) => prev.filter((b) => b._id !== budgetToDelete));
        setBudgetToDelete(null);
        addNotification('Budget deleted successfully', 'success');

        // Force a refresh to ensure we have the latest data
        setTimeout(() => refreshBudgets(), 500);
      } catch (error: any) {
        console.error('Delete error:', error);
        addNotification(error.message || 'Failed to delete budget', 'error');
      } finally {
        setIsDeleting(false);
      }
    }
    setIsDeleteModalOpen(false);
  };

  const totalBudgets = budgets.length;
  const totalAllocated = budgets.reduce(
    (sum, budget) => sum + budget.amount,
    0,
  );
  const totalSpent = budgets.reduce(
    (sum, budget) => sum + budget.currentSpent,
    0,
  );

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      {/* Notifications container */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded shadow-lg flex justify-between items-center ${
                notification.type === 'success'
                  ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                  : notification.type === 'error'
                    ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                    : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
              }`}
            >
              <span>{notification.message}</span>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <div className="flex space-x-2">
          <button
            className="p-2 bg-green-500 text-white rounded flex items-center"
            onClick={() => {
              setRefreshCounter((c) => c + 1);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>Loading...</>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Refresh
              </>
            )}
          </button>
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={handleAddBudget}
          >
            Add Budget
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 shadow rounded">
          <h2 className="text-lg font-bold">Total Budgets</h2>
          <p className="text-2xl">{totalBudgets}</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 shadow rounded">
          <h2 className="text-lg font-bold">Total Allocated</h2>
          <p className="text-2xl">{formatMoney(totalAllocated)}</p>
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300 shadow rounded">
          <h2 className="text-lg font-bold">Total Spent</h2>
          <p className="text-2xl">{formatMoney(totalSpent)}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-4 mb-4">Budgets List</h2>
      <BudgetTable
        budgets={budgets}
        onEdit={handleEditBudget}
        onDelete={handleDeleteBudget}
        isLoading={isLoading}
      />

      <BudgetFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setFormError(null);
        }}
        onSave={handleSaveBudget}
        budgetToEdit={budgetToEdit}
        categories={categories}
        error={formError}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Budgets;

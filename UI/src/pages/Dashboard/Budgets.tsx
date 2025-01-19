import React, { useState, useEffect } from 'react';
import BudgetTable from '../../components/Dashboard/Budgets/BudgetTable';
import BudgetFormModal from '../../components/Dashboard/Budgets/BudgetFormModal';
import ConfirmDeleteModal from '../../components/pop-ups/ConfirmDeleteModal';
import { BudgetResponse } from '../../interfaces/Budget';
import {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../../actions/budgetActions';
import { fetchCategories } from '../../actions/categoryActions';
import formatMoney from '../../utils/formatMoney';

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [categories, setCategories] = useState<{ name: string; _id: string }[]>(
    [],
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<BudgetResponse | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadBudgets = async () => {
      const fetchedBudgets = await fetchBudgets();
      setBudgets(fetchedBudgets);
    };
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    loadBudgets();
    loadCategories();
  }, []);

  const handleAddBudget = () => {
    setBudgetToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditBudget = (budget: BudgetResponse) => {
    setBudgetToEdit(budget);
    setIsFormModalOpen(true);
  };

  const handleDeleteBudget = (budgetId: string) => {
    setBudgetToDelete(budgetId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBudget = async (budget: BudgetResponse) => {
    if (budgetToEdit) {
      const updatedBudget = await updateBudget(budget);
      setBudgets((prev) =>
        prev.map((b) =>
          b._id === updatedBudget._id
            ? { ...updatedBudget, category: b.category, _id: updatedBudget._id }
            : b,
        ),
      );
    } else {
      const newBudget = await createBudget(budget);
      setBudgets((prev) => [...prev, newBudget]);
    }
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (budgetToDelete !== null) {
      await deleteBudget(budgetToDelete);
      setBudgets((prev) => prev.filter((b) => b._id !== budgetToDelete));
      setBudgetToDelete(null);
      alert('Budget deleted successfully');
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={handleAddBudget}
        >
          Add Budget
        </button>
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
      />
      <BudgetFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveBudget}
        budgetToEdit={budgetToEdit}
        categories={categories}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Budgets;

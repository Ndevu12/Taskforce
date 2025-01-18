import React, { useState } from 'react';
import BudgetTable from '../../components/Dashboard/BudgetTable';
import BudgetFormModal from '../../components/Dashboard/BudgetFormModal';
import ConfirmDeleteModal from '../../components/Dashboard/ConfirmDeleteModal';
import { Budget, BudgetPeriod } from '../../interfaces/Budget';

const initialBudgets: Budget[] = [
  {
    id: 1,
    name: 'Groceries',
    category: 'Food',
    amount: 500,
    period: BudgetPeriod.MONTHLY,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31'),
    currentSpent: 300,
    notificationThreshold: 80,
  },
  {
    id: 2,
    name: 'Rent',
    category: 'Housing',
    amount: 1000,
    period: BudgetPeriod.MONTHLY,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31'),
    currentSpent: 1000,
    notificationThreshold: 80,
  },
  {
    id: 3,
    name: 'Entertainment',
    category: 'Leisure',
    amount: 200,
    period: BudgetPeriod.MONTHLY,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31'),
    currentSpent: 150,
    notificationThreshold: 80,
  },
];

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<number | null>(null);

  const handleAddBudget = () => {
    setBudgetToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setBudgetToEdit(budget);
    setIsFormModalOpen(true);
  };

  const handleDeleteBudget = (budgetId: number) => {
    setBudgetToDelete(budgetId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBudget = (budget: Budget) => {
    if (budgetToEdit) {
      setBudgets((prev) => prev.map((b) => (b.id === budget.id ? budget : b)));
    } else {
      setBudgets((prev) => [...prev, { ...budget, id: prev.length + 1 }]);
    }
  };

  const handleConfirmDelete = () => {
    if (budgetToDelete !== null) {
      setBudgets((prev) => prev.filter((b) => b.id !== budgetToDelete));
      setBudgetToDelete(null);
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
          <p className="text-2xl">${totalAllocated}</p>
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300 shadow rounded">
          <h2 className="text-lg font-bold">Total Spent</h2>
          <p className="text-2xl">${totalSpent}</p>
        </div>
      </div>
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

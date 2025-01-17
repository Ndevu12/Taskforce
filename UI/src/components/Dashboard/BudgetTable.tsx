import React, { useState } from 'react';
import { Budget } from '../../interfaces/Budget';
import Pagination from '../common/Pagination';
import BudgetDetailModal from './BudgetDetailModal';

interface BudgetTableProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: number) => void;
}

const calculateProgress = (spent: number, allocated: number): number =>
  Math.min((spent / allocated) * 100, 100);

const BudgetTable: React.FC<BudgetTableProps> = ({
  budgets,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [budgetsPerPage, setBudgetsPerPage] = useState(3);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const indexOfLastBudget = currentPage * budgetsPerPage;
  const indexOfFirstBudget = indexOfLastBudget - budgetsPerPage;
  const currentBudgets = budgets.slice(indexOfFirstBudget, indexOfLastBudget);

  return (
    <div className="overflow-x-auto mt-7 border border-gray-200 p-4 rounded shadow">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Budget Name</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Allocated</th>
            <th className="py-2 px-4 border-b">Spent</th>
            <th className="py-2 px-4 border-b">Progress</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBudgets.map((budget) => {
            const progress = calculateProgress(
              budget.currentSpent,
              budget.amount,
            );
            let progressColor = 'bg-green-500';
            if (progress >= 80 && progress < 100) {
              progressColor = 'bg-yellow-500';
            } else if (progress >= 100) {
              progressColor = 'bg-red-500';
            }

            return (
              <tr
                key={budget.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedBudget(budget)}
              >
                <td className="py-2 px-4 border-b">{budget.name}</td>
                <td className="py-2 px-4 border-b">{budget.category}</td>
                <td className="py-2 px-4 border-b">{budget.amount}</td>
                <td className="py-2 px-4 border-b">{budget.currentSpent}</td>
                <td className="py-2 px-4 border-b">
                  <div className="relative w-full h-4 bg-gray-200 rounded">
                    <div
                      className={`absolute top-0 left-0 h-4 rounded ${progressColor}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-blue-500 mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(budget);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(budget.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={budgets.length}
        itemsPerPage={budgetsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setBudgetsPerPage}
      />
      {selectedBudget && (
        <BudgetDetailModal
          budget={selectedBudget}
          onClose={() => setSelectedBudget(null)}
        />
      )}
    </div>
  );
};

export default BudgetTable;

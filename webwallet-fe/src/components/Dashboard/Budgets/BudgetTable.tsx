import React, { useState } from 'react';
import { BudgetResponse } from '../../../types/interfaces/Budget';
import Pagination from '../../common/Pagination';
import BudgetDetailModal from './BudgetDetailModal';
import formatMoney from '../../../utils/formatMoney';

interface BudgetTableProps {
  budgets: BudgetResponse[];
  onEdit: (budget: BudgetResponse) => void;
  onDelete: (budgetId: string) => void;
  isLoading: boolean;
}

const calculateProgress = (spent: number, allocated: number): number =>
  allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;

const BudgetTable: React.FC<BudgetTableProps> = ({
  budgets,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [budgetsPerPage, setBudgetsPerPage] = useState(3);
  const [selectedBudget, setSelectedBudget] = useState<BudgetResponse | null>(
    null,
  );

  const indexOfLastBudget = currentPage * budgetsPerPage;
  const indexOfFirstBudget = indexOfLastBudget - budgetsPerPage;
  const currentBudgets = budgets.slice(indexOfFirstBudget, indexOfLastBudget);

  return (
    <div className="overflow-x-auto mt-7 border border-gray-200 dark:border-gray-700 p-4 rounded shadow dark:bg-gray-800">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
              Budget Description
            </th>
            <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
              Category
            </th>
            <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
              Allocated
            </th>
            <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
              Spent
            </th>
            <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
              Progress
            </th>
            <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: budgetsPerPage }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="animate-pulse">
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
              </tr>
            ))
          ) : currentBudgets.length > 0 ? (
            currentBudgets.map((budget) => {
              const progress = calculateProgress(
                budget.currentSpent,
                budget.amount,
              );
              let progressColor = 'bg-green-500 dark:bg-green-700';
              if (
                progress >= (budget.notificationThreshold || 80) &&
                progress < 100
              ) {
                progressColor = 'bg-yellow-500 dark:bg-yellow-700';
              } else if (progress >= 100) {
                progressColor = 'bg-red-500 dark:bg-red-700';
              }

              return (
                <tr
                  key={budget._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedBudget(budget)}
                >
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                    {budget.description}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                    {budget.category?.name}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                    {formatMoney(budget.amount)}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                    {formatMoney(budget.currentSpent)}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                    <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded">
                      <div
                        className={`absolute top-0 left-0 h-4 rounded ${progressColor}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                      <span className="absolute inset-0 text-xs text-center text-white leading-4">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                    <button
                      className="text-blue-500 dark:text-blue-300 mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(budget);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 dark:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(budget._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={6}
                className="py-4 px-4 border-b dark:border-gray-700 text-center"
              >
                No budgets available. Click &quot;Add Budget&quot; to create
                your first budget.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {budgets.length > budgetsPerPage && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalItems={budgets.length}
            itemsPerPage={budgetsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setBudgetsPerPage}
          />
        </div>
      )}

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

import React from 'react';
import { TransactionResponse } from '../../../types/interfaces/ITransaction';
import formatMoney from '../../../utils/formatMoney';

interface TransactionDetailsModalProps {
  transaction: TransactionResponse | null;
  onClose: () => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  // Function to determine color class based on category
  const getCategoryColorClass = (categoryName: string): string => {
    const normalizedName = categoryName.toUpperCase().trim();

    switch (normalizedName) {
      case 'INCOME':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800';
      case 'SAVING':
      case 'SAVINGS':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800';
      case 'INVESTMENT':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-800';
      case 'CREDIT':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800';
      case 'DEBT':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-800';
      case 'EXPENSE':
      default:
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800';
    }
  };

  // Get amount color based on category type
  const getAmountColor = (categoryName: string): string => {
    const normalizedName = categoryName.toUpperCase().trim();

    switch (normalizedName) {
      case 'INCOME':
        return 'text-green-600 dark:text-green-400';
      case 'SAVING':
      case 'SAVINGS':
        return 'text-blue-600 dark:text-blue-400';
      case 'INVESTMENT':
        return 'text-purple-600 dark:text-purple-400';
      case 'CREDIT':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'DEBT':
        return 'text-orange-600 dark:text-orange-400';
      case 'EXPENSE':
      default:
        return 'text-red-600 dark:text-red-400';
    }
  };

  const categoryName = transaction.category?.name || 'Uncategorized';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-lg dark:text-white">
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">
              <span className="font-semibold">Date:</span>{' '}
              {new Date(transaction.date).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Description:</span>{' '}
              {transaction.description || 'No description'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Amount:</span>{' '}
              <span className={getAmountColor(categoryName)}>
                {formatMoney(transaction.amount, 'RWF')}
              </span>
            </p>
          </div>

          <div>
            <p className="mb-2">
              <span className="font-semibold">Category:</span>{' '}
              <span
                className={`px-2 py-1 rounded ${getCategoryColorClass(categoryName)}`}
              >
                {categoryName}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Account:</span>{' '}
              {transaction.account?.name || 'Unknown Account'}
            </p>
          </div>
        </div>

        {transaction.budget && (
          <p className="mt-2">
            <span className="font-semibold">Budget:</span>{' '}
            {transaction.budget.description}
          </p>
        )}

        {transaction.subcategory && transaction.subcategory.length > 0 && (
          <p className="mt-2">
            <span className="font-semibold">Subcategory:</span>{' '}
            {transaction.subcategory.map((sub) => sub.name).join(', ')}
          </p>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;

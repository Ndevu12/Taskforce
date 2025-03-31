import React, { useState, useEffect } from 'react';
import {
  TransactionResponse,
  TransactionType,
} from '../../../types/interfaces/ITransaction';
import Pagination from '../../common/Pagination';
import formatMoney from '../../../utils/formatMoney';

interface OverviewTransactionTableProps {
  transactions: TransactionResponse[];
  onTransactionClick: (transaction: TransactionResponse) => void;
}

const OverviewTransactionTable: React.FC<OverviewTransactionTableProps> = ({
  transactions,
  onTransactionClick,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(5);
  const [filteredTransactions, setFilteredTransactions] =
    useState<TransactionResponse[]>(transactions);

  // Helper function to derive transaction type from category name
  const getTransactionTypeFromCategory = (
    categoryName: string,
  ): TransactionType => {
    if (!categoryName) return TransactionType.EXPENSE;

    const normalizedName = categoryName.toUpperCase().trim();

    switch (normalizedName) {
      case 'INCOME':
        return TransactionType.INCOME;
      case 'SAVING':
      case 'SAVINGS':
        return TransactionType.SAVINGS;
      case 'INVESTMENT':
        return TransactionType.INVESTMENT;
      case 'DEBT':
        return TransactionType.DEBT;
      case 'CREDIT':
        return TransactionType.CREDIT;
      case 'EXPENSE':
      default:
        return TransactionType.EXPENSE;
    }
  };

  useEffect(() => {
    // Process transactions to ensure they all have a derived type
    const processedTransactions = transactions.map((transaction) => {
      // Get category name and determine transaction type
      const categoryName = transaction.category?.name || 'Uncategorized';
      const derivedType = getTransactionTypeFromCategory(categoryName);

      // Create a new transaction object with the derived type
      return {
        ...transaction,
        type: derivedType,
      };
    });

    // Filter transactions based on search and type
    const filtered = processedTransactions
      .filter((transaction) => {
        const searchTerm = search.toLowerCase();
        return (
          searchTerm === '' ||
          transaction.description?.toLowerCase().includes(searchTerm) ||
          transaction.category?.name?.toLowerCase().includes(searchTerm) ||
          transaction.account?.name?.toLowerCase().includes(searchTerm)
        );
      })
      .filter((transaction) =>
        filterType ? transaction.type === filterType : true,
      );

    setFilteredTransactions(filtered);
  }, [search, filterType, transactions]);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );

  // Get appropriate color class for category display
  const getCategoryColorClass = (categoryName: string): string => {
    const type = getTransactionTypeFromCategory(categoryName);

    switch (type) {
      case TransactionType.INCOME:
        return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200';
      case TransactionType.SAVINGS:
        return 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200';
      case TransactionType.INVESTMENT:
        return 'bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-200';
      case TransactionType.DEBT:
        return 'bg-orange-200 text-orange-800 dark:bg-orange-700 dark:text-orange-200';
      case TransactionType.CREDIT:
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200';
      case TransactionType.EXPENSE:
      default:
        return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200';
    }
  };

  // Get amount color class based on transaction type
  const getAmountColorClass = (categoryName: string): string => {
    const type = getTransactionTypeFromCategory(categoryName);

    switch (type) {
      case TransactionType.INCOME:
      case TransactionType.SAVINGS:
      case TransactionType.INVESTMENT:
        return 'text-green-600 dark:text-green-400';
      case TransactionType.EXPENSE:
      case TransactionType.DEBT:
      case TransactionType.CREDIT:
        return 'text-red-600 dark:text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="border border-gray-300 rounded p-4 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search transactions..."
          className="p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          id="filterType"
          className="p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value={TransactionType.INCOME}>Income</option>
          <option value={TransactionType.EXPENSE}>Expense</option>
          <option value={TransactionType.SAVINGS}>Savings</option>
          <option value={TransactionType.INVESTMENT}>Investment</option>
          <option value={TransactionType.DEBT}>Debt</option>
          <option value={TransactionType.CREDIT}>Credit</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Date
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Description
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Amount
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Category
              </th>
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Account
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No transactions found
                </td>
              </tr>
            ) : (
              currentTransactions.map((transaction) => {
                const categoryName =
                  transaction.category?.name || 'Uncategorized';

                return (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => onTransactionClick(transaction)}
                  >
                    <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                      {transaction.description || 'No description'}
                    </td>
                    <td
                      className={`border-b p-2 text-sm sm:text-base dark:border-gray-700 ${getAmountColorClass(categoryName)} font-medium`}
                    >
                      {formatMoney(transaction.amount, 'RWF')}
                    </td>
                    <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                      <span
                        className={`px-2 py-1 rounded ${getCategoryColorClass(categoryName)}`}
                      >
                        {categoryName}
                      </span>
                    </td>
                    <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                      {transaction.account?.name || 'Unknown Account'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={filteredTransactions.length}
        itemsPerPage={transactionsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setTransactionsPerPage}
      />
    </div>
  );
};

export default OverviewTransactionTable;

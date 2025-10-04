import React, { useState, useEffect } from 'react';
import {
  TransactionResponse,
  ITransaction,
  TransactionType,
} from '../../../types/interfaces/ITransaction';
import Pagination from '../../common/Pagination';
import formatMoney from '../../../utils/formatMoney';

interface TransactionTableProps {
  transactions: TransactionResponse[] | ITransaction[];
  onEdit: (transaction: TransactionResponse) => void;
  onDelete: (transactionId: string) => void;
  onTransactionClick: (transaction: TransactionResponse) => void;
  loading?: boolean;
  error?: string | null;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  onTransactionClick,
  loading = false,
  error = null,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(5);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionResponse[]
  >([]);

  // Function to derive transaction type from category name
  const getTransactionTypeFromCategory = (
    categoryName: string,
  ): TransactionType => {
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
    // Process transactions to ensure they have a type derived from category
    const processedTransactions = transactions.map((transaction: any) => {
      // Ensure the transaction has populated objects
      const processedTransaction = {
        ...transaction,
        _id: transaction._id || '',
        account: transaction.account || { name: 'Unknown' },
        category: transaction.category || { name: 'Uncategorized' },
      };

      if (!processedTransaction.type) {
        // If server didn't provide a type, derive it from category name
        const categoryName =
          typeof processedTransaction.category === 'string'
            ? 'Uncategorized'
            : processedTransaction.category?.name || 'Uncategorized';

        processedTransaction.type =
          getTransactionTypeFromCategory(categoryName);
      }

      return processedTransaction;
    });

    const filtered = processedTransactions
      .filter(
        (transaction) =>
          transaction.description
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          transaction.category.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          transaction.account.name.toLowerCase().includes(search.toLowerCase()),
      )
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

  // Get category color class based on its derived transaction type
  const getCategoryColorClass = (categoryName: string) => {
    const type = getTransactionTypeFromCategory(categoryName);

    switch (type) {
      case TransactionType.INCOME:
        return 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200';
      case TransactionType.SAVINGS:
        return 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200';
      case TransactionType.INVESTMENT:
        return 'bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200';
      case TransactionType.CREDIT:
        return 'bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200';
      case TransactionType.DEBT:
        return 'bg-orange-200 dark:bg-orange-700 text-orange-800 dark:text-orange-200';
      case TransactionType.EXPENSE:
      default:
        return 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200';
    }
  };

  // Updated filter options - still filter by transaction type internally
  // but display category names as labels
  const transactionTypes = [
    { value: '', label: 'All Categories' },
    { value: TransactionType.INCOME, label: 'Income' },
    { value: TransactionType.EXPENSE, label: 'Expense' },
    { value: TransactionType.SAVINGS, label: 'Savings' },
    { value: TransactionType.INVESTMENT, label: 'Investment' },
    { value: TransactionType.DEBT, label: 'Debt' },
    { value: TransactionType.CREDIT, label: 'Credit' },
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded p-4 dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="sm:w-[30%] p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white mb-2 sm:mb-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="filterType" className="sr-only">
          Filter by category
        </label>
        <select
          id="filterType"
          className="p-2 border sm:w-[20%] border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {transactionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white dark:bg-gray-800">
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
              <th className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4">
                  <div className="animate-pulse">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="h-10 bg-gray-200 dark:bg-gray-700 mb-2 rounded"
                      ></div>
                    ))}
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center text-red-500 p-4">
                  {error}
                </td>
              </tr>
            ) : currentTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No transactions available at this time!
                </td>
              </tr>
            ) : (
              currentTransactions.map((transaction: any) => {
                const categoryName =
                  typeof transaction.category === 'string'
                    ? 'Uncategorized'
                    : transaction.category?.name || 'Uncategorized';

                const accountName =
                  typeof transaction.account === 'string'
                    ? 'Unknown Account'
                    : transaction.account?.name || 'Unknown Account';

                return (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() =>
                      onTransactionClick(transaction as TransactionResponse)
                    }
                  >
                    <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                      {transaction.description}
                    </td>
                    <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
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
                      {accountName}
                    </td>
                    <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                      <button
                        className="text-blue-500 dark:text-blue-300 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(transaction as TransactionResponse);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 dark:text-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(transaction._id);
                        }}
                      >
                        Delete
                      </button>
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

export default TransactionTable;

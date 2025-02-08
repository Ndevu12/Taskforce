import React, { useState, useEffect } from 'react';
import { TransactionResponse } from '../../../interfaces/ITransaction';
import Pagination from '../../common/Pagination';

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

  useEffect(() => {
    const filtered = transactions
      .filter(
        (transaction) =>
          transaction.description
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          transaction.category?.name
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

  return (
    <div className="border border-gray-300 rounded p-4 dark:bg-gray-800 dark:text-gray-300">
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="filterType" className="sr-only">
          Filter by type
        </label>
        <select
          id="filterType"
          className="p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="border-b p-2 text-sm sm:text-base">Date</th>
              <th className="border-b p-2 text-sm sm:text-base">Description</th>
              <th className="border-b p-2 text-sm sm:text-base">Amount</th>
              <th className="border-b p-2 text-sm sm:text-base">Type</th>
              <th className="border-b p-2 text-sm sm:text-base">Account</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onTransactionClick(transaction)}
              >
                <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                  {new Date(transaction.date).toDateString()}
                </td>
                <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                  {transaction.description}
                </td>
                <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                  {transaction.amount}
                </td>
                <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                  <span
                    className={`px-2 py-1 rounded ${transaction.type === 'INCOME' ? 'bg-green-200 dark:bg-green-700' : transaction.type === 'INCOME' ? 'bg-green-300 dark:bg-green-800' : 'bg-red-200 dark:bg-red-700'}`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="border-b p-2 text-sm sm:text-base">
                  {transaction.account.name}
                </td>
              </tr>
            ))}
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

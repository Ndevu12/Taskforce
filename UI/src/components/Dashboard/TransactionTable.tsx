import React, { useState } from 'react';
import { ITransaction } from '../../interfaces/ITransaction';
import Pagination from '../common/Pagination';

interface TransactionTableProps {
  transactions: ITransaction[];
  onTransactionClick: (transaction: ITransaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onTransactionClick,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(3);

  const filteredTransactions = transactions
    .filter(
      (transaction) =>
        transaction.description?.toLowerCase().includes(search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(search.toLowerCase()) ||
        transaction.account.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((transaction) =>
      filterType ? transaction.type === filterType : true,
    );

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );

  return (
    <div className="border  border-gray-400 rounded p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="p-2 border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="filterType" className="sr-only">
          Filter by type
        </label>
        <select
          id="filterType"
          className="p-2 border border-gray-300 rounded"
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
              <th className="border-b p-2 text-sm sm:text-base">Amount</th>
              <th className="border-b p-2 text-sm sm:text-base">Type</th>
              <th className="border-b p-2 text-sm sm:text-base">Account</th>
              <th className="border-b p-2 text-sm sm:text-base">Category</th>
              <th className="border-b p-2 text-sm sm:text-base">Description</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => onTransactionClick(transaction)}
              >
                <td className="border-b p-2 text-sm sm:text-base">
                  {transaction.date.toDateString()}
                </td>
                <td className="border-b p-2 text-sm sm:text-base">
                  {transaction.amount}
                </td>
                <td className="border-b p-2 text-sm sm:text-base">
                  {transaction.type}
                </td>
                <td className="border-b p-2 text-sm sm:text-base">
                  {transaction.account}
                </td>
                <td className="border-b p-2 text-sm sm:text-base">
                  {transaction.category}
                </td>
                <td className="border-b p-2 text-sm sm:text-base">
                  {transaction.description}
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

export default TransactionTable;

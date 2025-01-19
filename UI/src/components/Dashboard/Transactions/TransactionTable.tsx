import React, { useState, useEffect } from 'react';
import { ITransaction } from '../../../interfaces/ITransaction';
import Pagination from '../../common/Pagination';
import { fetchTransactionsByUser } from '../../../actions/transactionActions';

interface TransactionTableProps {
  userId: string;
  onEdit: (transaction: ITransaction) => void;
  onDelete: (transactionId: string) => void;
  onTransactionClick: (transaction: ITransaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  userId,
  onEdit,
  onDelete,
  onTransactionClick,
}) => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(5);
  const [filteredTransactions, setFilteredTransactions] = useState<
    ITransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactionsByUser(userId);
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError('There was an error getting your transactions');
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const filtered = transactions
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

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded p-4 dark:bg-gray-800">
      <div className="flex justify-between mb-4">
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
                  No transactions available at the time!
                </td>
              </tr>
            ) : (
              currentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
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
                      className={`px-2 py-1 rounded ${transaction.type === 'INCOME' ? 'bg-green-200 dark:bg-green-700' : 'bg-red-200 dark:bg-red-700'}`}
                    >
                      {transaction.category.name}
                    </span>
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    {transaction.account.name}
                  </td>
                  <td className="border-b p-2 text-sm sm:text-base dark:border-gray-700">
                    <button
                      className="text-blue-500 dark:text-blue-300 mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(transaction);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 dark:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(transaction.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TransactionTable from '../../components/Dashboard/Transactions/TransactionTable';
import TransactionDetailsModal from '../../components/Dashboard/Transactions/TransactionDetailsModal';
import TransactionFormModal from '../../components/Dashboard/Transactions/TransactionFormModal';
import TransactionSummaryCard from '../../components/Dashboard/Transactions/TransactionSummaryCard';
import ConfirmDeleteModal from '../../components/pop-ups/ConfirmDeleteModal';
import {
  ITransaction,
  TransactionResponse,
} from '../../types/interfaces/ITransaction';
import {
  fetchTransactionsByUser,
  deleteTransaction,
} from '../../actions/transactionActions';
import { fetchCategories } from '../../actions/categoryActions';

const Transactions: React.FC = () => {
  const [transactionData, setTransactionData] = useState<{
    transactions: ITransaction[];
    summary: {
      totalTransactions: number;
      totalIncome: number;
      totalExpenses: number;
      netAmount: number;
    };
  }>({
    transactions: [],
    summary: {
      totalTransactions: 0,
      totalIncome: 0,
      totalExpenses: 0,
      netAmount: 0,
    },
  });
  const [categories, setCategories] = useState<{ name: string; _id: string }[]>(
    [],
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionResponse | null>(null);
  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionResponse | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await fetchTransactionsByUser();
      setTransactionData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('There was an error getting your transactions');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchTransactions();
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('There was an error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddTransaction = () => {
    setTransactionToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditTransaction = (transaction: TransactionResponse) => {
    setTransactionToEdit(transaction);
    setIsFormModalOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTransaction = async () => {
    await fetchTransactions();
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete !== null) {
      await deleteTransaction(transactionToDelete);
      await fetchTransactions();
      setTransactionToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  // Use server-provided summary values
  const { totalTransactions, totalIncome, totalExpenses, netAmount } =
    transactionData.summary;

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddTransaction}
        >
          Add Transaction
        </button>
      </div>

      {/* Simple Transaction Summary Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold">Transaction Summary</h2>
          <Link
            to="/dashboard/transaction-summary"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            View Detailed Summary
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <TransactionSummaryCard
            title="Total Transactions"
            loading={loading}
            error={error || undefined}
            amount={error ? 0 : totalTransactions}
            colorClass="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
          />
          <TransactionSummaryCard
            title="Income"
            amount={totalIncome}
            loading={loading}
            error={error || undefined}
            colorClass="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
          />
          <TransactionSummaryCard
            title="Expenses"
            amount={totalExpenses}
            loading={loading}
            error={error || undefined}
            colorClass="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
          />
          <TransactionSummaryCard
            title="Net Balance"
            amount={netAmount}
            loading={loading}
            error={error || undefined}
            colorClass={
              netAmount >= 0
                ? 'bg-green-300 dark:bg-green-900 text-blue-800 dark:text-blue-200'
                : 'bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
            }
          />
        </div>
      </div>

      <h3 className="text-lg font-bold mt-4 mb-4">Recent Transactions</h3>
      <TransactionTable
        transactions={transactionData.transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onTransactionClick={setSelectedTransaction}
        loading={loading}
        error={error}
      />
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
        categories={categories}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default Transactions;

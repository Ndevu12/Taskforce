import React, { useState, useEffect } from 'react';
import TransactionTable from '../../components/Dashboard/Transactions/TransactionTable';
import TransactionDetailsModal from '../../components/Dashboard/Transactions/TransactionDetailsModal';
import TransactionFormModal from '../../components/Dashboard/Transactions/TransactionFormModal';
import ConfirmDeleteModal from '../../components/pop-ups/ConfirmDeleteModal';
import {
  ITransaction,
  TransactionResponse,
} from '../../interfaces/ITransaction';
import {
  fetchTransactionsByUser,
  deleteTransaction,
} from '../../actions/transactionActions';
import { fetchCategories } from '../../actions/categoryActions';
import formatMoney from '../../utils/formatMoney';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactionsByUser();
        setTransactions(data);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError('There was an error getting your transactions');
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

  const handleSaveTransaction = (transaction: ITransaction) => {
    if (transactionToEdit) {
      setTransactions((prev) =>
        prev.map((t) => (t._id === transaction._id ? transaction : t)),
      );
    } else {
      setTransactions((prev) => [
        ...prev,
        { ...transaction, _id: (prev.length + 1).toString() },
      ]);
    }
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete !== null) {
      await deleteTransaction(transactionToDelete);
      setTransactions((prev) =>
        prev.filter((t) => t._id !== transactionToDelete),
      );
      setTransactionToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const totalTransactions = transactions.length;
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME' || t.type === 'SAVING')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={handleAddTransaction}
        >
          Add Transaction
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 shadow rounded">
          <h2 className="text-lg font-bold">Total Transactions</h2>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ) : (
            <p className="text-2xl">{error ? 0 : totalTransactions}</p>
          )}
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 shadow rounded">
          <h2 className="text-lg font-bold">Total Revenue</h2>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ) : (
            <p className="text-2xl">
              {error ? 0 : formatMoney(totalIncome, 'RWF')}
            </p>
          )}
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300 shadow rounded">
          <h2 className="text-lg font-bold">Total Expenses</h2>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ) : (
            <p className="text-2xl">
              {error ? 0 : formatMoney(totalExpenses, 'RWF')}
            </p>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold mt-4 mb-4">Recently Transactions</h3>
      <TransactionTable
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onTransactionClick={setSelectedTransaction}
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

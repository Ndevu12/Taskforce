import React, { useState } from 'react';
import TransactionTable from '../../components/Dashboard/TransactionTable';
import TransactionDetailsModal from '../../components/Dashboard/TransactionDetailsModal';
import TransactionFormModal from '../../components/Dashboard/TransactionFormModal';
import ConfirmDeleteModal from '../../components/Dashboard/ConfirmDeleteModal';
import { ITransaction } from '../../interfaces/ITransaction';

const initialTransactions: ITransaction[] = [
  {
    id: '1',
    date: new Date('2025-01-01'),
    description: 'Groceries',
    amount: 50,
    type: 'EXPENSE',
    category: 'Food',
    account: 'Debit Card',
  },
  {
    id: '2',
    date: new Date('2025-01-02'),
    description: 'Salary',
    amount: 1500,
    type: 'INCOME',
    category: 'Work',
    account: 'Bank Account',
  },
  {
    id: '3',
    date: new Date('2025-01-03'),
    description: 'Movie Tickets',
    amount: 30,
    type: 'EXPENSE',
    category: 'Entertainment',
    account: 'Credit Card',
  },
];

const Transactions: React.FC = () => {
  const [transactions, setTransactions] =
    useState<ITransaction[]>(initialTransactions);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const [transactionToEdit, setTransactionToEdit] =
    useState<ITransaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null,
  );

  const handleAddTransaction = () => {
    setTransactionToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditTransaction = (transaction: ITransaction) => {
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
        prev.map((t) => (t.id === transaction.id ? transaction : t)),
      );
    } else {
      setTransactions((prev) => [
        ...prev,
        { ...transaction, id: (prev.length + 1).toString() },
      ]);
    }
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete !== null) {
      setTransactions((prev) =>
        prev.filter((t) => t.id !== transactionToDelete),
      );
      setTransactionToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const totalTransactions = transactions.length;
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4">
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
        <div className="p-4 bg-blue-100 text-blue-800 shadow rounded">
          <h2 className="text-lg font-bold">Total Transactions</h2>
          <p className="text-2xl">{totalTransactions}</p>
        </div>
        <div className="p-4 bg-green-100 text-green-800 shadow rounded">
          <h2 className="text-lg font-bold">Total Income</h2>
          <p className="text-2xl">${totalIncome}</p>
        </div>
        <div className="p-4 bg-red-100 text-red-800 shadow rounded">
          <h2 className="text-lg font-bold">Total Expenses</h2>
          <p className="text-2xl">${totalExpenses}</p>
        </div>
      </div>
      <TransactionTable
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onTransactionClick={setSelectedTransaction}
      />
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
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

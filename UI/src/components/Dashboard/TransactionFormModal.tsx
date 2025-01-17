import React, { useState, useEffect } from 'react';
import { ITransaction } from '../../interfaces/ITransaction';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: ITransaction) => void;
  transactionToEdit?: ITransaction | null;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  transactionToEdit,
}) => {
  const [transaction, setTransaction] = useState<ITransaction>({
    id: '',
    account: '',
    category: '',
    type: 'EXPENSE',
    amount: 0,
    description: '',
    date: new Date(),
  });

  useEffect(() => {
    if (transactionToEdit) {
      setTransaction(transactionToEdit);
    }
  }, [transactionToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(transaction);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl mb-4">
          {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={transaction.date.toISOString().split('T')[0]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              title="Date"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={transaction.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter description"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={transaction.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              min="0"
              title="Amount"
              placeholder="Enter amount"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Type</label>
            <select
              name="type"
              value={transaction.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              title="Type"
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={transaction.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter category"
              required
              title="Category"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Account</label>
            <input
              type="text"
              name="account"
              value={transaction.account}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter account"
              required
              title="Account"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Subcategory (optional)</label>
            <input
              type="text"
              name="subcategory"
              value={transaction.subcategory || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter subcategory"
              title="Subcategory"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 p-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;

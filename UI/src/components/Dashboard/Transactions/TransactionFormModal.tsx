import React, { useState, useEffect } from 'react';
import {
  ITransaction,
  TransactionResponse,
} from '../../../interfaces/ITransaction';
import {
  createTransaction,
  updateTransaction,
} from '../../../actions/transactionActions';
import { fetchAccounts } from '../../../actions/accountActions';
import { fetchSubcategories } from '../../../actions/subcategoryActions';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: ITransaction) => void;
  transactionToEdit?: TransactionResponse | null;
  categories: any[];
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  transactionToEdit,
  categories,
}) => {
  const [transaction, setTransaction] = useState<ITransaction>({
    _id: '',
    account: '',
    category: '',
    type: 'EXPENSE',
    amount: 0,
    description: '',
    date: new Date(),
  });
  const [subcategories, setSubcategories] = useState<
    { name: string; _id: string }[]
  >([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (transactionToEdit) {
      setTransaction({
        _id: transactionToEdit._id,
        account: transactionToEdit._id,
        category: transactionToEdit.category._id,
        type: transactionToEdit.type,
        amount: transactionToEdit.amount,
        description: transactionToEdit.description,
        date: transactionToEdit.date,
      });
      setSelectedCategory(transactionToEdit.category._id);
      fetchSubcategories(transactionToEdit.category._id);
    }
  }, [transactionToEdit]);

  useEffect(() => {
    const fetchData = async () => {
      const accountsData = await fetchAccounts();
      setAccounts(accountsData);
      if (accountsData.length === 1) {
        setTransaction((prev) => ({ ...prev, account: accountsData[0]._id }));
      } else if (accountsData.length === 0) {
        alert('Please create an account first.');
        onClose();
      }
    };
    fetchData();
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    console.log(categoryId);

    setTransaction((prev) => ({
      ...prev,
      category: categoryId,
      type: categoryId === 'INCOME' ? 'INCOME' : 'EXPENSE',
    }));
    const subcategoriesData = await fetchSubcategories(categoryId);
    setSubcategories(subcategoriesData);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!transaction.description)
      newErrors.description = 'Description is required';
    if (!transaction.amount || transaction.amount <= 0)
      newErrors.amount = 'Amount must be greater than zero';
    if (!transaction.date) newErrors.date = 'Date is required';
    if (accounts.length < 2)
      newErrors.accounts =
        'You must have at least two accounts to save a transaction';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const transactionData = { ...transaction, id: undefined };
    if (transactionToEdit) {
      await updateTransaction(transaction?._id, transactionData);
    } else {
      await createTransaction(transactionData);
    }
    onSave(transactionData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-xl mb-4">
          {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={new Date(transaction.date).toISOString().split('T')[0]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              required
              title="Date"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={transaction.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              placeholder="Enter description"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={transaction.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              required
              min="0"
              title="Amount"
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              name="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              required
              title="Category"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Account
            </label>
            <select
              name="account"
              value={transaction.account}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              required
              title="Account"
            >
              {accounts.map((account: { _id: string; name: string }) => (
                <option key={account._id} value={account._id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 md:col-span-3">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Subcategory (optional)
            </label>
            <select
              name="subcategory"
              value={transaction.subcategory || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              title="Subcategory"
            >
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
          {errors.accounts && (
            <p className="text-red-500 text-sm mb-4">{errors.accounts}</p>
          )}
          <div className="flex justify-end md:col-span-3">
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

import React, { useState, useEffect } from 'react';
import {
  ITransaction,
  TransactionResponse,
} from '../../../types/interfaces/ITransaction';
import {
  createTransaction,
  updateTransaction,
} from '../../../actions/transactionActions';
import { fetchAccounts } from '../../../actions/accountActions';
import { fetchSubcategories } from '../../../actions/subcategoryActions';
import { fetchBudgets } from '../../../actions/budgetActions';

interface CategoryType {
  _id: string;
  name: string;
}

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: ITransaction) => void;
  transactionToEdit?: TransactionResponse | null;
  categories: CategoryType[];
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
    amount: 0,
    description: '',
    date: new Date(),
  });
  const [subcategories, setSubcategories] = useState<
    { name: string; _id: string }[]
  >([]);
  const [accounts, setAccounts] = useState<{ _id: string; name: string }[]>([]);
  const [budgets, setBudgets] = useState<
    { _id: string; description: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Add states for better UX
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Enhanced state for better account error handling
  const [noAccountsAvailable, setNoAccountsAvailable] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    if (transactionToEdit) {
      setTransaction({
        _id: transactionToEdit._id,
        account: transactionToEdit.account._id,
        category: transactionToEdit.category._id,
        budget: transactionToEdit.budget?._id,
        amount: transactionToEdit.amount,
        description: transactionToEdit.description,
        date: transactionToEdit.date,
      });
      setSelectedCategory(transactionToEdit.category._id);
      setSelectedCategoryName(transactionToEdit.category.name);
      fetchSubcategories(transactionToEdit.category._id);
    }
  }, [transactionToEdit]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;

      // Reset errors when modal opens
      setErrors({});
      setAccountsError(null);
      setNoAccountsAvailable(false);
      setPermissionError(null);

      try {
        // Fetch accounts with proper error handling
        setAccountsLoading(true);
        try {
          const accountsData = await fetchAccounts();

          if (Array.isArray(accountsData)) {
            setAccounts(accountsData);

            // Only set default account when creating a new transaction (not editing)
            if (!transactionToEdit && accountsData.length === 1) {
              setTransaction((prev) => ({
                ...prev,
                account: accountsData[0]._id,
              }));
            }

            // Handle case of no accounts
            if (accountsData.length === 0) {
              setNoAccountsAvailable(true);
              setAccountsError(
                "You don't have any accounts. Please create an account first.",
              );
            }
          } else {
            setAccountsError('Failed to load accounts properly');
          }
        } catch (accError: any) {
          console.error('Error fetching accounts:', accError);
          setAccountsError(
            accError.response?.data?.error || 'Failed to fetch accounts',
          );
        }
        setAccountsLoading(false);

        // Fetch budgets
        const budgetsData = await fetchBudgets();
        if (Array.isArray(budgetsData)) {
          setBudgets(
            budgetsData.map((budget) => ({
              _id: budget._id,
              description: budget.description || '',
            })),
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isOpen, transactionToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));

    // Clear specific field errors when user makes changes
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    // Find the selected category
    const selectedCat = categories.find((cat) => cat._id === categoryId);
    const categoryName = selectedCat?.name || '';
    setSelectedCategoryName(categoryName);

    setTransaction((prev) => ({
      ...prev,
      category: categoryId,
    }));

    try {
      const subcategoriesData = await fetchSubcategories(categoryId);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!transaction.description)
      newErrors.description = 'Description is required';
    if (!transaction.amount || transaction.amount <= 0)
      newErrors.amount = 'Amount must be greater than zero';
    if (!transaction.date) newErrors.date = 'Date is required';
    if (!transaction.account) newErrors.account = 'Account is required';
    if (!transaction.category) newErrors.category = 'Category is required';

    // Budget is required for expense category
    if (selectedCategoryName === 'EXPENSE' && !transaction.budget) {
      newErrors.budget = 'Budget is required for expense transactions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setErrors({});
      setPermissionError(null);

      const transactionData = { ...transaction };

      try {
        if (transactionToEdit) {
          await updateTransaction(transaction._id || '', transactionData);
        } else {
          await createTransaction(transactionData);
        }

        onSave(transactionData);
        onClose();
      } catch (error: any) {
        // Handle API errors with meaningful messages
        console.error('Transaction submission error:', error);

        if (error.response?.data?.error) {
          const errorMessage = error.response.data.error;

          // Handle specific account permission errors
          if (
            errorMessage.includes('permission') &&
            errorMessage.includes('account')
          ) {
            setPermissionError(
              'You do not have permission to use this account. Please create a new account or select one of your accounts.',
            );
            setErrors({
              account:
                'You do not have permission to use this account. Please select one of your accounts.',
              submit: errorMessage,
            });
          } else {
            setErrors({ submit: errorMessage });
          }
        } else {
          setErrors({
            submit: 'Failed to save transaction. Please try again.',
          });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Function to navigate to account creation
  const navigateToCreateAccount = () => {
    window.location.href = '/dashboard/accounts';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed mt-10 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded shadow-md w-full max-w-3xl my-4 flex flex-col max-h-[90vh]">
        {/* Fixed header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-gray-200">
            {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {/* No accounts or permission error message with prominent action button */}
          {(noAccountsAvailable || permissionError) && (
            <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-800 text-red-700 dark:text-red-300 rounded">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <p className="font-medium text-lg">Account Required</p>
                  <p className="text-sm mb-2">
                    {permissionError ||
                      accountsError ||
                      'You need to create an account first.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={navigateToCreateAccount}
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                >
                  Create New Account
                </button>
              </div>
            </div>
          )}

          {/* Regular account error without the "create account" prompt */}
          {accountsError && !noAccountsAvailable && !permissionError && (
            <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-800 text-red-700 dark:text-red-300 rounded">
              <p className="font-medium">Account Error</p>
              <p className="text-sm">{accountsError}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="mb-3">
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
            <div className="mb-3">
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
            <div className="mb-3">
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
            <div className="mb-3">
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
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Account
              </label>
              {accountsLoading ? (
                <div className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 animate-pulse">
                  Loading accounts...
                </div>
              ) : (
                <>
                  <select
                    name="account"
                    value={transaction.account}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded dark:text-gray-300 ${
                      errors.account || permissionError
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:bg-gray-700'
                    }`}
                    required
                    disabled={accounts.length === 0}
                    title="Account"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                  {/* If we have a permission error, show a create account button directly under the dropdown */}
                  {(errors.account || permissionError) && (
                    <button
                      type="button"
                      onClick={navigateToCreateAccount}
                      className="mt-2 text-blue-500 hover:text-blue-700 flex items-center text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create New Account
                    </button>
                  )}
                </>
              )}
              {errors.account && (
                <p className="text-red-500 text-sm mt-1">{errors.account}</p>
              )}
            </div>

            {/* Show budget selector only for expense category */}
            {selectedCategoryName === 'EXPENSE' && (
              <div className="mb-3">
                <label className="block mb-1 text-gray-700 dark:text-gray-300">
                  Budget
                </label>
                <select
                  name="budget"
                  value={transaction.budget || ''}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded dark:text-gray-300 ${
                    errors.budget
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:bg-gray-700'
                  }`}
                  required
                  title="Budget"
                >
                  <option value="">Select Budget</option>
                  {budgets.map((budget) => (
                    <option key={budget._id} value={budget._id}>
                      {budget.description}
                    </option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                )}
              </div>
            )}

            <div className="mb-3 md:col-span-2">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Subcategory (optional)
              </label>
              <select
                name="subcategory"
                value={transaction.subcategory?.[0] || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                title="Subcategory"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            {errors.submit && (
              <div className="p-3 border border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-800 text-red-700 dark:text-red-300 rounded md:col-span-2">
                <p className="font-medium">Error</p>
                <p>{errors.submit}</p>
              </div>
            )}
          </form>
        </div>

        {/* Fixed footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-end justify-end">
          <div>
            <button
              type="button"
              className="mr-2 p-2 bg-gray-300 dark:bg-gray-600 dark:text-white rounded"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className={`p-2 bg-blue-500 text-white rounded ${
                submitting || accounts.length === 0
                  ? 'opacity-75 cursor-not-allowed'
                  : 'hover:bg-blue-600'
              }`}
              disabled={submitting || accounts.length === 0}
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFormModal;

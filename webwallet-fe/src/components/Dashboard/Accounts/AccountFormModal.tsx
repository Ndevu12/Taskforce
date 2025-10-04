import React, { useState, useEffect } from 'react';
import { Account, AccountType } from '../../../types/interfaces/Account';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => void;
  accountToEdit?: Account | null;
  error?: string | null; // Add error prop
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  accountToEdit,
  error, // Receive error from parent
}) => {
  const [account, setAccount] = useState<Account>({
    _id: '',
    name: '',
    type: AccountType.BANK,
    balance: 0,
    currency: 'RWF',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [initialBalance, setInitialBalance] = useState<number>(0);

  useEffect(() => {
    if (accountToEdit) {
      setAccount(accountToEdit);
      // Store initial balance for comparison
      setInitialBalance(Number(accountToEdit.balance));
    } else {
      // Reset form for new account
      setAccount({
        _id: '',
        name: '',
        type: AccountType.BANK,
        balance: 0,
        currency: 'RWF',
        isActive: true,
      });
      setInitialBalance(0);
    }
    // Set general error when provided from parent
    setGeneralError(error || null);
  }, [accountToEdit, error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Clear field-specific error when user makes changes
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear general error when user makes any change
    if (generalError) {
      setGeneralError(null);
    }

    // Update field value with appropriate type conversion
    if (name === 'balance') {
      setAccount((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'isActive') {
      setAccount((prev) => ({ ...prev, [name]: value === 'true' }));
    } else if (name !== 'currency') {
      // Prevent changes to currency
      setAccount((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!account.name.trim()) {
      errors.name = 'Account name is required';
    }

    if (account.balance < 0 && account.type !== AccountType.CREDIT) {
      errors.balance = 'Non-credit accounts cannot have negative balance';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Ensure correct data types before submitting
    const formattedAccount = {
      ...account,
      balance: Number(account.balance),
      isActive: Boolean(account.isActive),
    };

    console.log('Submitting account with balance:', formattedAccount.balance);
    console.log('Initial balance was:', initialBalance);

    onSave(formattedAccount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed mt-10 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md w-96">
        <h2 className="text-xl mb-4 text-gray-700 dark:text-gray-300">
          {accountToEdit ? 'Edit Account' : 'Add Account'}
        </h2>

        {/* Display general error at the top of the form */}
        {generalError && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Account Name
            </label>
            <input
              type="text"
              name="name"
              value={account.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300 ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter account name"
              title="Account Name"
              required
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              name="type"
              value={account.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              required
              title="Account Type"
            >
              {Object.values(AccountType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Initial Balance
            </label>
            <input
              type="number"
              name="balance"
              value={account.balance}
              onChange={handleChange}
              className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300 ${
                formErrors.balance ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
              title="Initial Balance"
              placeholder="Enter initial balance"
            />
            {formErrors.balance && (
              <p className="text-red-500 text-sm mt-1">{formErrors.balance}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Currency
            </label>
            <input
              type="text"
              name="currency"
              value={account.currency}
              readOnly
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              title="Currency"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              name="isActive"
              value={account.isActive ? 'true' : 'false'}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              required
              title="Status"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 p-2 bg-gray-300 rounded dark:bg-gray-700 dark:text-white"
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

export default AccountFormModal;

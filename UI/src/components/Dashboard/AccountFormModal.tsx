import React, { useState, useEffect } from 'react';
import { Account, AccountType } from '../../interfaces/Account';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => void;
  accountToEdit?: Account | null;
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  accountToEdit,
}) => {
  const [account, setAccount] = useState<Account>({
    id: 0,
    name: '',
    type: AccountType.BANK,
    balance: 0,
    currency: 'USD',
    isActive: true, // Auto-filled as true
  });

  useEffect(() => {
    if (accountToEdit) {
      setAccount(accountToEdit);
    }
  }, [accountToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(account);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96">
        <h2 className="text-xl mb-4 text-gray-700 dark:text-gray-300">
          {accountToEdit ? 'Edit Account' : 'Add Account'}
        </h2>
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
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              placeholder="Enter account name"
              title="Account Name"
              required
            />
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
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              required
              min="0"
              title="Initial Balance"
              placeholder="Enter initial balance"
            />
          </div>
          {/* Removed Status field */}
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

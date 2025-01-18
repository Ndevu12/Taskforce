import React, { useState } from 'react';
import AccountTable from '../../components/Dashboard/AccountTable';
import AccountFormModal from '../../components/Dashboard/AccountFormModal';
import ConfirmDeleteModal from '../../components/Dashboard/ConfirmDeleteModal';
import { Account, AccountType } from '../../interfaces/Account';

const initialAccounts: Account[] = [
  {
    id: 1,
    name: 'Saving account',
    type: AccountType.BANK,
    balance: 5000,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 2,
    name: 'Checking Account',
    type: AccountType.BANK,
    balance: 2000,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 3,
    name: 'Credit Card',
    type: AccountType.CREDIT,
    balance: -1500,
    currency: 'USD',
    isActive: false,
  },
  {
    id: 4,
    name: 'MOBILE MONEY',
    type: AccountType.MOBILE_MONEY,
    balance: -1500,
    currency: 'USD',
    isActive: false,
  },
];

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

  const handleAddAccount = () => {
    setAccountToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setAccountToEdit(account);
    setIsFormModalOpen(true);
  };

  const handleDeleteAccount = (accountId: number) => {
    setAccountToDelete(accountId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAccount = (account: Account) => {
    if (accountToEdit) {
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === account.id ? account : acc)),
      );
    } else {
      setAccounts((prev) => [...prev, { ...account, id: prev.length + 1 }]);
    }
  };

  const handleConfirmDelete = () => {
    if (accountToDelete !== null) {
      setAccounts((prev) => prev.filter((acc) => acc.id !== accountToDelete));
      setAccountToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((account) => account.isActive).length;
  const inactiveAccounts = totalAccounts - activeAccounts;

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={handleAddAccount}
        >
          Add Account
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 shadow rounded">
          <h2 className="text-lg font-bold">Total Accounts</h2>
          <p className="text-2xl">{totalAccounts}</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 shadow rounded">
          <h2 className="text-lg font-bold">Active Accounts</h2>
          <p className="text-2xl">{activeAccounts}</p>
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300 shadow rounded">
          <h2 className="text-lg font-bold">Inactive Accounts</h2>
          <p className="text-2xl">{inactiveAccounts}</p>
        </div>
      </div>
      <AccountTable
        accounts={accounts}
        onEdit={handleEditAccount}
        onDelete={handleDeleteAccount}
      />
      <AccountFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveAccount}
        accountToEdit={accountToEdit}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Accounts;

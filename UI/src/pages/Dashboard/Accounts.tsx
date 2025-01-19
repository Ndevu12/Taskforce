import React, { useState, useEffect } from 'react';
import AccountTable from '../../components/Dashboard/Accounts/AccountTable';
import AccountFormModal from '../../components/Dashboard/Accounts/AccountFormModal';
import ConfirmDeleteModal from '../../components/pop-ups/ConfirmDeleteModal';
import AccountDetailsModal from '../../components/Dashboard/Accounts/AccountDetailsModal';
import { Account } from '../../interfaces/Account';
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../../actions/accountActions';

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [accountToView, setAccountToView] = useState<Account | null>(null);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await fetchAccounts();
        setAccounts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const handleAddAccount = () => {
    setAccountToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setAccountToEdit(account);
    setIsFormModalOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccountToDelete(accountId);
    setIsDeleteModalOpen(true);
  };

  const handleViewAccount = (account: Account) => {
    setAccountToView(account);
    setIsDetailsModalOpen(true);
  };

  const handleSaveAccount = async (account: Account) => {
    try {
      if (accountToEdit) {
        const updatedAccount = await updateAccount(account);
        setAccounts((prev) =>
          prev.map((acc) =>
            acc._id === updatedAccount._id ? updatedAccount : acc,
          ),
        );
      } else {
        const newAccount = await createAccount(account);
        setAccounts((prev) => [...prev, newAccount]);
        alert('Account created successfully');
      }
      setIsFormModalOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (accountToDelete !== null) {
      try {
        await deleteAccount(accountToDelete);
        setAccounts((prev) =>
          prev.filter((acc) => acc._id !== accountToDelete),
        );
        setAccountToDelete(null);
        alert('Account deleted successfully');
      } catch (error) {
        console.error(error);
        alert('Failed to delete account');
      }
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
        onView={handleViewAccount}
        isLoading={isLoading}
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
      <AccountDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        account={accountToView}
      />
    </div>
  );
};

export default Accounts;

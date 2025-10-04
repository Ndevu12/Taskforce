import React, { useState, useEffect } from 'react';
import AccountTable from '../../components/Dashboard/Accounts/AccountTable';
import AccountFormModal from '../../components/Dashboard/Accounts/AccountFormModal';
import ConfirmDeleteModal from '../../components/pop-ups/ConfirmDeleteModal';
import AccountDetailsModal from '../../components/Dashboard/Accounts/AccountDetailsModal';
import { Account } from '../../types/interfaces/Account';
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  updateAccountBalance, // Add the new import
} from '../../actions/accountActions';

// Add notification type
type NotificationType = 'success' | 'error' | 'info';

// Add notification interface
interface Notification {
  message: string;
  type: NotificationType;
  id: number;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [accountToView, setAccountToView] = useState<Account | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Add state for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Function to add a notification
  const addNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, id }]);

    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id),
      );
    }, 5000);
  };

  // Function to dismiss a notification
  const dismissNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  // Function to refresh account data from server
  const refreshAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAccounts();
      setAccounts(data.reverse());
      addNotification('Accounts refreshed successfully', 'success');
    } catch (error: any) {
      addNotification(error.message || 'Failed to refresh accounts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadAccounts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAccounts();
        setAccounts(data.reverse());
      } catch (error: any) {
        addNotification(error.message || 'Failed to load accounts', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, [refreshCounter]); // Add refreshCounter to dependencies to force reload

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
      setFormError(null); // Reset error before attempting save

      if (accountToEdit) {
        // Check if balance has changed
        const balanceChanged =
          accountToEdit &&
          Number(account.balance) !== Number(accountToEdit.balance);

        let updatedAccount;

        // First update general account fields
        updatedAccount = await updateAccount({
          ...account,
          // Don't include balance in the general update
          balance: accountToEdit.balance,
        });

        // If balance changed, call the balance-specific endpoint
        if (balanceChanged) {
          updatedAccount = await updateAccountBalance(
            account._id,
            account.balance,
          );
        }

        // Update accounts with the new data
        setAccounts((prev) => {
          const updated = prev.map((acc) =>
            acc._id === updatedAccount._id ? updatedAccount : acc,
          );
          return updated;
        });

        addNotification('Account updated successfully', 'success');
      } else {
        const newAccount = await createAccount(account);
        setAccounts((prev) => [...prev, newAccount]);
        addNotification('Account created successfully', 'success');
      }
      setIsFormModalOpen(false);

      // Force a refresh to ensure we have the latest data
      setTimeout(() => refreshAccounts(), 500);
    } catch (error: any) {
      // Extract error message from different possible sources
      const errorMessage =
        error.response?.data?.error || // API error response
        error.message || // Error object message
        'Failed to save account'; // Fallback message

      console.error('Account error:', error);
      setFormError(errorMessage);
      // Don't close modal on error
    }
  };

  const handleConfirmDelete = async () => {
    if (accountToDelete !== null) {
      setIsDeleting(true);
      try {
        await deleteAccount(accountToDelete);
        setAccounts((prev) =>
          prev.filter((acc) => acc._id !== accountToDelete),
        );
        setAccountToDelete(null);
        addNotification('Account deleted successfully', 'success');

        // Force a refresh to ensure we have the latest data
        setTimeout(() => refreshAccounts(), 500);
      } catch (error: any) {
        console.error('Delete error:', error);
        addNotification(error.message || 'Failed to delete account', 'error');
      } finally {
        setIsDeleting(false);
      }
    }
    setIsDeleteModalOpen(false);
  };

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((account) => account.isActive).length;
  const inactiveAccounts = totalAccounts - activeAccounts;

  return (
    <div className="p-4 dark:bg-gray-900 overflow-auto dark:text-white">
      {/* Notifications container */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded shadow-lg flex justify-between items-center ${
                notification.type === 'success'
                  ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                  : notification.type === 'error'
                    ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                    : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
              }`}
            >
              <span>{notification.message}</span>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <div className="flex space-x-2">
          <button
            className="p-2 bg-green-500 text-white rounded flex items-center"
            onClick={() => {
              setRefreshCounter((c) => c + 1);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>Loading...</>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Refresh
              </>
            )}
          </button>
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={handleAddAccount}
          >
            Add Account
          </button>
        </div>
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
      <h2 className="text-lg font-bold mb-4">All Accounts</h2>
      <AccountTable
        accounts={accounts}
        onEdit={handleEditAccount}
        onDelete={handleDeleteAccount}
        onView={handleViewAccount}
        isLoading={isLoading}
      />
      <AccountFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setFormError(null); // Clear error when closing modal
        }}
        onSave={handleSaveAccount}
        accountToEdit={accountToEdit}
        error={formError} // Pass error to the modal
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
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

import React, { useState } from 'react';
import { Account } from '../../../types/interfaces/Account';
import Pagination from '../../common/Pagination';
import formatMoney from '../../../utils/formatMoney';
import { CircularProgress, Chip, Tooltip } from '@mui/material';
import { ExclamationTriangleIcon as WarningIcon } from '@heroicons/react/24/outline';

interface AccountTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onView: (account: Account) => void;
  isLoading: boolean;
}

const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onEdit,
  onDelete,
  onView,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage, setAccountsPerPage] = useState(5);

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount,
  );

  // Helper function to determine account status styles
  const getStatusStyles = (account: Account) => {
    if (!account.isActive) {
      return 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200';
    }

    // Low balance warning for non-credit accounts
    if (account.balance < 10000 && account.type !== 'CREDIT') {
      return 'bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200';
    }

    return 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200';
  };

  // Function to get account type label
  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'BANK':
        return 'Bank Account';
      case 'CASH':
        return 'Cash';
      case 'MOBILE_MONEY':
        return 'Mobile Money';
      default:
        return type;
    }
  };

  return (
    <div className="overflow-x-auto mt-7 border border-gray-200 dark:border-gray-700 p-4 rounded shadow dark:bg-gray-800">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
          <p className="ml-2">Loading accounts...</p>
        </div>
      ) : (
        <>
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  Account Name
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  Type
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  Balance
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  Status
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.length > 0 ? (
                currentAccounts.map((account) => (
                  <tr
                    key={account._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => onView(account)}
                  >
                    <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                      {account.name}
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                      {getAccountTypeLabel(account.type)}
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                      <div className="flex items-center">
                        {formatMoney(account.balance)}
                        {account.balance < 10000 &&
                          account.type !== 'CREDIT' && (
                            <Tooltip title="Low balance warning">
                              <WarningIcon className="h-5 w-5 text-yellow-500 ml-2" />
                            </Tooltip>
                          )}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                      <Chip
                        label={account.isActive ? 'Active' : 'Inactive'}
                        className={`px-2 py-1 rounded ${getStatusStyles(account)}`}
                        size="small"
                      />
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                      <button
                        className="text-blue-500 dark:text-blue-300 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(account);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 dark:text-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(account._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 px-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No accounts available yet. Create your first account to get
                    started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {accounts.length > accountsPerPage && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalItems={accounts.length}
                itemsPerPage={accountsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setAccountsPerPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AccountTable;

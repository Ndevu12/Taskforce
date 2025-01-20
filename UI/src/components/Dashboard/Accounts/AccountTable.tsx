import React, { useState } from 'react';
import { Account } from '../../../interfaces/Account';
import Pagination from '../../common/Pagination';

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
  const [accountsPerPage, setAccountsPerPage] = useState(3);

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount,
  );

  return (
    <div className="overflow-x-auto mt-7 border border-gray-200 dark:border-gray-700 p-4 rounded shadow dark:bg-gray-800">
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
          {isLoading ? (
            Array.from({ length: accountsPerPage }).map((_, index) => (
              <tr key={`loading-${index}`} className="animate-pulse">
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
              </tr>
            ))
          ) : currentAccounts.length > 0 ? (
            currentAccounts.map((account) => (
              <tr
                key={account._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => onView(account)}
              >
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  {account.name}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  {account.type}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  {account.balance}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  <span
                    className={`px-2 py-1 rounded ${account.isActive ? 'bg-green-200 dark:bg-green-700' : 'bg-red-200 dark:bg-red-700'}`}
                  >
                    {account.isActive ? 'Active' : 'Inactive'}
                  </span>
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
              <td colSpan={5} className="py-2 px-4 text-center">
                No account available yet!
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={accounts.length}
        itemsPerPage={accountsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setAccountsPerPage}
      />
    </div>
  );
};

export default AccountTable;

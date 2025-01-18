import React, { useState } from 'react';
import { Account } from '../../interfaces/Account';
import Pagination from '../common/Pagination';

interface AccountTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (accountId: number) => void;
}

const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onEdit,
  onDelete,
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
            <th className="py-2 px-4 border-b dark:border-gray-700">
              Account Name
            </th>
            <th className="py-2 px-4 border-b dark:border-gray-700">Type</th>
            <th className="py-2 px-4 border-b dark:border-gray-700">Balance</th>
            <th className="py-2 px-4 border-b dark:border-gray-700">Status</th>
            <th className="py-2 px-4 border-b dark:border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAccounts.map((account) => (
            <tr
              key={account.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="py-2 px-4 border-b dark:border-gray-700">
                {account.name}
              </td>
              <td className="py-2 px-4 border-b dark:border-gray-700">
                {account.type}
              </td>
              <td className="py-2 px-4 border-b dark:border-gray-700">
                {account.balance}
              </td>
              <td className="py-2 px-4 border-b dark:border-gray-700">
                <span
                  className={`px-2 py-1 rounded ${account.isActive ? 'bg-green-200 dark:bg-green-700' : 'bg-red-200 dark:bg-red-700'}`}
                >
                  {account.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-2 px-4 border-b dark:border-gray-700">
                <button
                  className="text-blue-500 dark:text-blue-300 mr-2"
                  onClick={() => onEdit(account)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 dark:text-red-300"
                  onClick={() => onDelete(account.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
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

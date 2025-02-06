import React from 'react';
import { Account } from '../../../interfaces/Account';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  isOpen,
  onClose,
  account,
}) => {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96">
        <h2 className="text-xl mb-4 text-gray-700 dark:text-gray-300">
          Account Details
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <strong>Name:</strong>
          </div>
          <div className="col-span-2">{account.name}</div>
          <div className="col-span-1">
            <strong>Type:</strong>
          </div>
          <div className="col-span-2">{account.type}</div>
          <div className="col-span-1">
            <strong>Balance:</strong>
          </div>
          <div className="col-span-2">{account.balance}</div>
          <div className="col-span-1">
            <strong>Currency:</strong>
          </div>
          <div className="col-span-2">{account.currency}</div>
          <div className="col-span-1">
            <strong>Account Number:</strong>
          </div>
          <div className="col-span-2">{account.accountNumber}</div>
          <div className="col-span-1">
            <strong>Status:</strong>
          </div>
          <div className="col-span-2">
            {account.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="p-2 bg-blue-500 text-white rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsModal;

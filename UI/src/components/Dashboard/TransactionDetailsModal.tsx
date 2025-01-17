import React from 'react';
import { ITransaction } from '../../interfaces/ITransaction';

interface TransactionDetailsModalProps {
  transaction: ITransaction | null;
  onClose: () => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
        <p>
          <strong>Date:</strong> {transaction.date.toDateString()}
        </p>
        <p>
          <strong>Description:</strong> {transaction.description}
        </p>
        <p>
          <strong>Amount:</strong> ${transaction.amount}
        </p>
        <p>
          <strong>Type:</strong> {transaction.type}
        </p>
        <p>
          <strong>Category:</strong> {transaction.category}
        </p>
        <p>
          <strong>Account:</strong> {transaction.account}
        </p>
        {transaction.subcategory && (
          <p>
            <strong>Subcategory:</strong> {transaction.subcategory}
          </p>
        )}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="p-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;

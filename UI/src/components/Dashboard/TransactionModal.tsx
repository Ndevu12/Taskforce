import React from 'react';
import { ITransaction } from '../../interfaces/ITransaction';

interface TransactionModalProps {
  transaction: ITransaction | null;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
        <p>
          <strong>Date:</strong> {transaction.date.toDateString()}
        </p>
        <p>
          <strong>Amount:</strong> {transaction.amount}
        </p>
        <p>
          <strong>Type:</strong> {transaction.type}
        </p>
        <p>
          <strong>Account:</strong> {transaction.account}
        </p>
        <p>
          <strong>Category:</strong> {transaction.category}
        </p>
        <p>
          <strong>Description:</strong> {transaction.description}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionModal;

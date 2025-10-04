import React, { useState } from 'react';
import formatMoney from '../../../utils/formatMoney';

interface TransactionSummaryCardProps {
  title: string;
  amount: number;
  categories?: Record<string, number>;
  colorClass: string;
  loading?: boolean;
  error?: string;
}

const TransactionSummaryCard: React.FC<TransactionSummaryCardProps> = ({
  title,
  amount,
  categories,
  colorClass,
  loading = false,
  error = null,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`p-4 shadow rounded ${colorClass}`}>
      <div
        className="flex flex-col justify-between items-center cursor-pointer"
        onClick={() =>
          categories &&
          Object.keys(categories).length > 0 &&
          setExpanded(!expanded)
        }
      >
        <h3 className="text-lg font-bold">{title}</h3>
        {loading && (
          <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        )}

        {error && (
          <div className="text-red-500 border border-red-300 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex items-center">
            <span className="text-xl font-semibold mr-2">
              {formatMoney(amount, 'RWF')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionSummaryCard;

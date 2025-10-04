import React from 'react';

interface BudgetProgressBarProps {
  value: number;
}

const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({ value }) => {
  // Cap the value at 100% for display purposes
  const displayValue = Math.min(value, 100);

  // Determine color based on percentage
  let color = 'bg-green-500';
  if (value >= 100) {
    color = 'bg-red-500';
  } else if (value >= 80) {
    color = 'bg-yellow-500';
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`${color} h-2.5 rounded-full`}
        style={{ width: `${displayValue}%` }}
      ></div>
    </div>
  );
};

export default BudgetProgressBar;

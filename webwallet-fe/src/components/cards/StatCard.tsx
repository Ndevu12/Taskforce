import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md flex flex-col items-center justify-center ${color}`}
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      <p className="mt-2 text-md sm:text-l font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default StatCard;

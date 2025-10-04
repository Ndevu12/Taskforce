import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  trend,
  trendValue,
}) => {
  return (
    <div className={`${color} p-6 rounded-lg shadow-md`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex items-end">
        <p className="text-2xl font-bold">{value}</p>

        {trend && trendValue && (
          <div
            className={`flex items-center ml-3 ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpIcon className="w-5 h-5" />
            ) : (
              <ArrowDownIcon className="w-5 h-5" />
            )}
            <span className="ml-1 text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

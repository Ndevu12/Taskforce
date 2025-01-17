import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex-1 min-w-[220px]">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-2xl mt-2">{value}</p>
    </div>
  );
};

export default StatCard;

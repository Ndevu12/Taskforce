import React from 'react';

interface ChartCardProps {
  title: string;
  placeholder: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, placeholder }) => {
  return (
    <div className="bg-white p-6 sm:p-3 rounded-lg shadow-md flex-1 min-w-[300px]">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-64 bg-gray-100 flex items-center justify-center overflow-x-auto">
        <p>{placeholder}</p>
      </div>
    </div>
  );
};

export default ChartCard;

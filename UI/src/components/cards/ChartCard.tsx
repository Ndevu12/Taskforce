import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface ChartCardProps {
  title: string;
  type: 'bar' | 'doughnut';
  data: any;
  options?: any;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  options,
}) => {
  return (
    <div className="bg-white p-6 sm:p-3 rounded-lg shadow-md flex-1 min-w-[300px]">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-64 bg-gray-100 flex items-center justify-center overflow-x-auto">
        {type === 'bar' && <Bar data={data} options={options} />}
        {type === 'doughnut' && <Doughnut data={data} options={options} />}
      </div>
    </div>
  );
};

export default ChartCard;

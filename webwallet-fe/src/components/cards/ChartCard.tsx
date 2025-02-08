import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface ChartCardProps {
  title: string;
  type: 'bar' | 'doughnut' | 'line';
  data: any;
  options?: any;
  className?: string;
  height?: string;
  description?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  options,
  className = '',
  height = 'h-64',
  description,
}) => {
  const defaultOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const doughnutOptions = {
    ...defaultOptions,
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'center' as const,
      },
    },
  };

  const lineOptions = {
    ...defaultOptions,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartOptions =
    type === 'doughnut'
      ? options || doughnutOptions
      : type === 'line'
        ? options || lineOptions
        : options || defaultOptions;

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 ${className}`}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          {description}
        </p>
      )}
      <div
        className={`${height} flex items-center justify-center overflow-hidden`}
      >
        {type === 'bar' && <Bar data={data} options={chartOptions} />}
        {type === 'doughnut' && <Doughnut data={data} options={chartOptions} />}
        {type === 'line' && <Line data={data} options={chartOptions} />}
      </div>
    </div>
  );
};

export default ChartCard;

import React from 'react';
import ChartCard from '../../cards/ChartCard';
import { TransactionResponse } from '../../../interfaces/ITransaction';

interface ChartsProps {
  transactions: TransactionResponse[];
}

const Charts: React.FC<ChartsProps> = ({ transactions }) => {
  // Group transactions by type and category
  const transactionsByTypeAndCategory = transactions.reduce(
    (acc, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = {};
      }
      acc[curr.type][curr.category.name] =
        (acc[curr.type][curr.category.name] || 0) + curr.amount;
      return acc;
    },
    {} as Record<string, Record<string, number>>,
  );

  const allCategories = [...new Set(transactions.map((t) => t.category.name))];

  const chartColors = {
    EXPENSE: {
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
    },
    INCOME: {
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
    },
    SAVING: {
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
    },
  };

  const spendingTrendsData = {
    labels: allCategories,
    datasets: Object.entries(transactionsByTypeAndCategory).map(
      ([type, categories]) => ({
        label: type,
        data: allCategories.map((category) => categories[category] || 0),
        backgroundColor:
          chartColors[type as keyof typeof chartColors].backgroundColor,
        borderColor: chartColors[type as keyof typeof chartColors].borderColor,
        borderWidth: 1,
      }),
    ),
  };

  // Calculate totals for the budget progress chart
  const totalsByType = Object.entries(transactionsByTypeAndCategory).reduce(
    (acc, [type, categories]) => {
      acc[type] = Object.values(categories).reduce(
        (sum, amount) => sum + amount,
        0,
      );
      return acc;
    },
    {} as Record<string, number>,
  );

  const budgetProgressData = {
    labels: Object.keys(totalsByType),
    datasets: [
      {
        data: Object.values(totalsByType),
        backgroundColor: Object.keys(totalsByType).map(
          (type) =>
            chartColors[type as keyof typeof chartColors].backgroundColor,
        ),
        borderColor: Object.keys(totalsByType).map(
          (type) => chartColors[type as keyof typeof chartColors].borderColor,
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="flex flex-wrap gap-4">
      <ChartCard
        title="Transaction Analysis by Category"
        type="bar"
        data={spendingTrendsData}
      />
      <ChartCard
        title="Transaction Distribution"
        type="doughnut"
        data={budgetProgressData}
      />
    </section>
  );
};

export default Charts;

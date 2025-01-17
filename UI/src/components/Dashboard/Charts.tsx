import React from 'react';
import ChartCard from '../../components/cards/ChartCard';
import { ITransaction } from '../../interfaces/ITransaction';

interface ChartsProps {
  transactions: ITransaction[];
}

const Charts: React.FC<ChartsProps> = ({ transactions }) => {
  const totalSpendByCategory = transactions
    .filter((transaction) => transaction.type === 'EXPENSE')
    .reduce(
      (acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

  const budgetLimit = 10000;
  const totalSpend = Object.values(totalSpendByCategory).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  const spendingTrendsData = {
    labels: Object.keys(totalSpendByCategory),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(totalSpendByCategory),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const budgetProgressData = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [totalSpend, budgetLimit - totalSpend],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="flex flex-wrap gap-4">
      <ChartCard title="Spending Trends" type="bar" data={spendingTrendsData} />
      <ChartCard
        title="Budget Progress"
        type="doughnut"
        data={budgetProgressData}
      />
    </section>
  );
};

export default Charts;

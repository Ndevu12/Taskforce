import React, { useState } from 'react';
import StatCard from '../../components/cards/StatCard';
import OverviewTransactionTable from '../../components/Dashboard/OverviewTransactionTable';
import TransactionDetailsModal from '../../components/Dashboard/TransactionDetailsModal';
import Charts from '../../components/Dashboard/Charts';
import { ITransaction } from '../../interfaces/ITransaction';

const transactions: ITransaction[] = [
  {
    id: '1',
    date: new Date('2023-10-01'),
    amount: 500,
    type: 'INCOME',
    account: 'Bank',
    category: 'Salary',
    description: 'Monthly salary',
  },
  {
    id: '2',
    date: new Date('2023-10-02'),
    amount: 50,
    type: 'EXPENSE',
    account: 'Credit Card',
    category: 'Groceries',
    description: 'Grocery shopping',
  },
  {
    id: '3',
    date: new Date('2025-10-02'),
    amount: 500,
    type: 'INCOME',
    account: 'Bank',
    category: 'Salary',
    description: 'Monthly salary',
  },
  {
    id: '4',
    date: new Date('2025-12-02'),
    amount: 150,
    type: 'EXPENSE',
    account: 'Credit Card',
    category: 'House rent',
    description: 'Grocery shopping',
  },
  // ...more dummy transactions
];

const Overview: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Welcome, User!</h1>
        <p className="mt-2">
          Here&apos;s a quick overview of your financial status.
        </p>
      </section>

      {/* Quick Stats Section */}
      <section className="flex flex-wrap gap-4">
        <StatCard title="Total Balance" value="$10,000" />
        <StatCard title="Monthly Income" value="$5,000" />
        <StatCard title="Monthly Expenses" value="$2,000" />
        <StatCard title="Savings Progress" value="$3,000" />
      </section>

      {/* Recent Transactions Table */}
      <OverviewTransactionTable
        transactions={transactions}
        onTransactionClick={setSelectedTransaction}
      />

      {/* Graphs/Charts Section */}
      <Charts transactions={transactions} />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default Overview;

import React from 'react';
import StatCard from '../../components/cards/StatCard';
import ChartCard from '../../components/cards/ChartCard';

interface Transaction {
  date: string;
  amount: string;
  type: string;
  account: string;
  category: string;
}

const transactions: Transaction[] = [
  {
    date: '2023-10-01',
    amount: '$500',
    type: 'Income',
    account: 'Bank',
    category: 'Salary',
  },
  {
    date: '2023-10-02',
    amount: '$50',
    type: 'Expense',
    account: 'Credit Card',
    category: 'Groceries',
  },
  // ...more dummy transactions
];

const Overview: React.FC = () => {
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
      <section className="bg-white p-6 sm:p-3 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b p-2">Date</th>
                <th className="border-b p-2">Amount</th>
                <th className="border-b p-2">Type</th>
                <th className="border-b p-2">Account</th>
                <th className="border-b p-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="border-b p-2">{transaction.date}</td>
                  <td className="border-b p-2">{transaction.amount}</td>
                  <td className="border-b p-2">{transaction.type}</td>
                  <td className="border-b p-2">{transaction.account}</td>
                  <td className="border-b p-2">{transaction.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Graphs/Charts Section */}
      <section className="flex flex-wrap gap-4">
        <ChartCard
          title="Spending Trends"
          placeholder="Spending Trends Chart"
        />
        <ChartCard
          title="Budget Progress"
          placeholder="Budget Progress Chart"
        />
      </section>
    </div>
  );
};

export default Overview;

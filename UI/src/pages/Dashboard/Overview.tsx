import React, { useState, useEffect } from 'react';
import StatCard from '../../components/cards/StatCard';
import OverviewTransactionTable from '../../components/Dashboard/Overview/OverviewTransactionTable';
import TransactionDetailsModal from '../../components/Dashboard/Transactions/TransactionDetailsModal';
import Charts from '../../components/Dashboard/Overview/Charts';
import { TransactionResponse } from '../../interfaces/ITransaction';
import { fetchTransactionsByUser } from '../../actions/transactionActions';
import formatMoney from '../../utils/formatMoney';

const Overview: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionResponse | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [savingsProgress, setSavingsProgress] = useState(0);

  useEffect(() => {
    const loadTransactions = async () => {
      const fetchedTransactions = await fetchTransactionsByUser();
      setTransactions(fetchedTransactions);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      let income = 0;
      let expenses = 0;
      let balance = 0;

      fetchedTransactions.forEach((transaction: TransactionResponse) => {
        if (transaction.type === 'INCOME') {
          income += transaction.amount;
        } else if (transaction.type === 'EXPENSE') {
          expenses += transaction.amount;
        }

        if (
          new Date(transaction.date).getMonth() === currentMonth &&
          new Date(transaction.date).getFullYear() === currentYear
        ) {
          if (transaction.type === 'INCOME') {
            balance += transaction.amount;
          } else if (transaction.type === 'EXPENSE') {
            balance -= transaction.amount;
          }
        }
      });

      setTotalBalance(balance);
      setMonthlyIncome(income);
      setMonthlyExpenses(expenses);
      setSavingsProgress(income - expenses);
    };

    loadTransactions();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-md dark:bg-gradient-to-r dark:from-blue-800 dark:to-indigo-900">
        <h1 className="text-4xl font-bold">Welcome, User!</h1>
        <p className="mt-2 text-lg">
          Here&apos;s a quick overview of your financial status.
        </p>
      </section>

      {/* Quick Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatMoney(totalBalance)}
          color="bg-green-200 dark:bg-green-700"
        />
        <StatCard
          title="Monthly Income"
          value={formatMoney(monthlyIncome)}
          color="bg-blue-200 dark:bg-blue-700"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatMoney(monthlyExpenses)}
          color="bg-red-200 dark:bg-red-700"
        />
        <StatCard
          title="Savings Progress"
          value={formatMoney(savingsProgress)}
          color="bg-yellow-200 dark:bg-yellow-700"
        />
      </section>

      {/* Recent Transactions Table */}
      <h3 className="text-xl font-semibold mb-4">Recently transactions</h3>
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

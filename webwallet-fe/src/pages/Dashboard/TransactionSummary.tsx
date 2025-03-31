import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TransactionSummaryCard from '../../components/Dashboard/Transactions/TransactionSummaryCard';
import { fetchTransactionSummary } from '../../actions/transactionActions';
import { TransactionSummary as ITransactionSummary } from '../../types/interfaces/ITransaction';
import formatMoney from '../../utils/formatMoney';

const TransactionSummary: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [summary, setSummary] = useState<ITransactionSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const summaryData = await fetchTransactionSummary(startDate, endDate);
      setSummary(summaryData);
      setSummaryLoading(false);
    } catch (err) {
      console.error('Failed to fetch transaction summary:', err);
      setError('Failed to load transaction summary');
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleDateFilterChange = () => {
    fetchSummary();
  };

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transaction Summary</h1>
        <Link
          to="/dashboard/transactions"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Transactions
        </Link>
      </div>

      {/* Date filter */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h2 className="text-lg font-semibold mb-2">Filter by Date Range</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="startDate" className="block mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="self-end">
            <button
              onClick={handleDateFilterChange}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={summaryLoading}
            >
              {summaryLoading ? 'Loading...' : 'Apply Filter'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>
      )}

      {summaryLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : summary ? (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Summary Period</h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <p>
                From:{' '}
                <span className="font-semibold">
                  {summary.summary.period.start}
                </span>
              </p>
              <p>
                To:{' '}
                <span className="font-semibold">
                  {summary.summary.period.end}
                </span>
              </p>
              <p className="mt-2">
                Total Transactions:{' '}
                <span className="font-semibold">
                  {summary.summary.statistics.totalTransactions}
                </span>
              </p>
              {summary.summary.statistics.mostActiveDay && (
                <p>
                  Most Active Day:{' '}
                  <span className="font-semibold">
                    {summary.summary.statistics.mostActiveDay}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Financial Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <TransactionSummaryCard
                title="Income"
                amount={summary.summary.income.total}
                categories={summary.summary.income.categories}
                colorClass="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
              />
              <TransactionSummaryCard
                title="Expenses"
                amount={summary.summary.expenses.total}
                categories={summary.summary.expenses.categories}
                colorClass="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
              />
              <TransactionSummaryCard
                title="Net Income"
                amount={summary.summary.netIncome}
                colorClass={
                  summary.summary.netIncome >= 0
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                    : 'bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
                }
              />
              {summary.summary.savings.total > 0 && (
                <TransactionSummaryCard
                  title="Savings"
                  amount={summary.summary.savings.total}
                  categories={summary.summary.savings.categories}
                  colorClass="bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200"
                />
              )}
              {summary.summary.investments.total > 0 && (
                <TransactionSummaryCard
                  title="Investments"
                  amount={summary.summary.investments.total}
                  categories={summary.summary.investments.categories}
                  colorClass="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200"
                />
              )}
              {summary.summary.debt.total > 0 && (
                <TransactionSummaryCard
                  title="Debt"
                  amount={summary.summary.debt.total}
                  categories={summary.summary.debt.categories}
                  colorClass="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
                />
              )}
              {summary.summary.credit.total > 0 && (
                <TransactionSummaryCard
                  title="Credit"
                  amount={summary.summary.credit.total}
                  categories={summary.summary.credit.categories}
                  colorClass="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
                />
              )}
            </div>
          </div>

          {summary.summary.statistics.mostUsedCategories &&
            Object.keys(summary.summary.statistics.mostUsedCategories).length >
              0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Most Used Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(
                    summary.summary.statistics.mostUsedCategories,
                  ).map(([type, category]) => (
                    <div
                      key={type}
                      className="bg-gray-100 dark:bg-gray-800 p-3 rounded"
                    >
                      <p className="font-semibold">{type}</p>
                      <p>{category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Daily Activity</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr>
                    <th className="p-2 border-b dark:border-gray-700 text-left">
                      Date
                    </th>
                    <th className="p-2 border-b dark:border-gray-700 text-right">
                      Transactions
                    </th>
                    <th className="p-2 border-b dark:border-gray-700 text-right">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary.summary.statistics.byDate)
                    .sort(
                      (a, b) =>
                        new Date(b[0]).getTime() - new Date(a[0]).getTime(),
                    )
                    .map(([date, data]) => (
                      <tr
                        key={date}
                        className={
                          date === summary.summary.statistics.mostActiveDay
                            ? 'bg-blue-50 dark:bg-blue-900'
                            : ''
                        }
                      >
                        <td className="p-2 border-b dark:border-gray-700">
                          {date}
                        </td>
                        <td className="p-2 border-b dark:border-gray-700 text-right">
                          {data.count}
                        </td>
                        <td className="p-2 border-b dark:border-gray-700 text-right">
                          {formatMoney(data.amount, 'RWF')}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <p>
            No transaction data available. Please apply a filter or check back
            later.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionSummary;

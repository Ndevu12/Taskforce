import React, { useState, useEffect } from 'react';
import StatCard from '../../components/cards/StatCard';
import OverviewTransactionTable from '../../components/Dashboard/Overview/OverviewTransactionTable';
import TransactionDetailsModal from '../../components/Dashboard/Transactions/TransactionDetailsModal';
import Charts from '../../components/Dashboard/Overview/Charts';
import { TransactionResponse } from '../../types/interfaces/ITransaction';
import formatMoney from '../../utils/formatMoney';
import { fetchDashboardOverview } from '../../actions/analyticsActions';
import { fetchTransactionsByUser } from '../../actions/transactionActions';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import BudgetProgressBar from '../../components/Dashboard/Budgets/BudgetProgressBar';
import { getToken } from '../../utils/tokenUtils';
import { useAuth } from '../../context/AuthContext';

const Overview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionResponse | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionResponse[]
  >([]);
  const { decodeToken } = useAuth();

  const token = getToken();
  const user = token ? decodeToken(token) : null;

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardOverview();
        setOverviewData(data);
        setError(null);

        // Use recent transactions from analytics if available
        if (data?.recentTransactions?.length > 0) {
          setRecentTransactions(data.recentTransactions);
        } else {
          // Fallback to fetch regular transactions if analytics doesn't provide them
          const transactionData = await fetchTransactionsByUser();
          setRecentTransactions(transactionData.transactions || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Dashboard loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
        <p className="ml-2">Loading dashboard data...</p>
      </div>
    );

  if (error)
    return (
      <Alert severity="error" className="my-4">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );

  if (!overviewData) return null;

  const {
    accounts,
    incomeExpense,
    budgets,
    savingsInvestment,
    financialHealth,
  } = overviewData;

  return (
    <div className="space-y-8 px-2 sm:px-6 bg-gray-100 dark:bg-gray-900">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-md dark:bg-gradient-to-r dark:from-blue-800 dark:to-indigo-900">
        {user ? (
          <h1 className="text-4xl font-bold mb-2">Hello {user.name},</h1>
        ) : null}
        <h1 className="text-2xl font-bold">
          Welcome to Your Financial Dashboard!
        </h1>
        <p className="mt-2 text-lg">
          Here&apos;s your complete financial overview as of{' '}
          {new Date(overviewData.timestamp).toLocaleDateString()}.
        </p>
      </section>

      {/* Quick Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatMoney(accounts.totalBalance)}
          color="bg-green-200 dark:bg-green-700"
          trend={incomeExpense.percentChange.netIncome > 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(incomeExpense.percentChange.netIncome).toFixed(1)}%`}
        />
        <StatCard
          title="Monthly Income"
          value={formatMoney(incomeExpense.currentMonth.income)}
          color="bg-blue-200 dark:bg-blue-700"
          trend={incomeExpense.percentChange.income > 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(incomeExpense.percentChange.income).toFixed(1)}%`}
        />
        <StatCard
          title="Monthly Expenses"
          value={formatMoney(incomeExpense.currentMonth.expenses)}
          color="bg-red-200 dark:bg-red-700"
          trend={incomeExpense.percentChange.expenses < 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(incomeExpense.percentChange.expenses).toFixed(1)}%`}
        />
        <StatCard
          title="Savings & Investments"
          value={formatMoney(
            savingsInvestment.total.savings +
              savingsInvestment.total.investment,
          )}
          color="bg-yellow-200 dark:bg-yellow-700"
        />
      </section>

      {/* Financial Health Section */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Financial Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent>
              <Typography variant="h6" component="h3" className="mb-2">
                Savings Rate
              </Typography>
              <Box className="flex items-center">
                <div className="relative inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={Math.min(financialHealth.savingsRate, 100)}
                    size={60}
                    thickness={5}
                    className={
                      financialHealth.savingsRate >= 20
                        ? 'text-green-500'
                        : 'text-orange-500'
                    }
                  />
                  <Box className="absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center">
                    <Typography
                      variant="caption"
                      component="div"
                      color="textSecondary"
                    >
                      {`${Math.round(financialHealth.savingsRate)}%`}
                    </Typography>
                  </Box>
                </div>
                <Typography variant="body2" className="ml-3">
                  {financialHealth.savingsRate >= 20
                    ? "Great! You're saving a healthy portion of your income."
                    : 'Consider increasing your savings rate to at least 20% of income.'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent>
              <Typography variant="h6" component="h3" className="mb-2">
                Expense Ratio
              </Typography>
              <Box className="flex items-center">
                <div className="relative inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={Math.min(financialHealth.expenseRatio, 100)}
                    size={60}
                    thickness={5}
                    className={
                      financialHealth.expenseRatio <= 80
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  />
                  <Box className="absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center">
                    <Typography
                      variant="caption"
                      component="div"
                      color="textSecondary"
                    >
                      {`${Math.round(financialHealth.expenseRatio)}%`}
                    </Typography>
                  </Box>
                </div>
                <Typography variant="body2" className="ml-3">
                  {financialHealth.expenseRatio <= 80
                    ? 'Good job keeping expenses under control!'
                    : 'Your expenses are high relative to your income. Consider budgeting.'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent>
              <Typography variant="h6" component="h3" className="mb-2">
                Debt Service Ratio
              </Typography>
              <Box className="flex items-center">
                <div className="relative inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={Math.min(financialHealth.debtServiceRatio, 100)}
                    size={60}
                    thickness={5}
                    className={
                      financialHealth.debtServiceRatio <= 30
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  />
                  <Box className="absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center">
                    <Typography
                      variant="caption"
                      component="div"
                      color="textSecondary"
                    >
                      {`${Math.round(financialHealth.debtServiceRatio)}%`}
                    </Typography>
                  </Box>
                </div>
                <Typography variant="body2" className="ml-3">
                  {financialHealth.debtServiceRatio <= 30
                    ? 'Your debt payments are at a manageable level.'
                    : 'Your debt payments are high - try to reduce debt if possible.'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts Section */}
      <Charts analyticsData={overviewData} className="mb-8" />

      {/* Budget Status Section */}
      {budgets.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Budget Status</h3>
          <div className="grid grid-cols-1 gap-4">
            {budgets.slice(0, 3).map((budget: any) => (
              <Card
                key={budget.id}
                className={`shadow-sm ${
                  budget.isExceeded
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : budget.isApproachingLimit
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : 'bg-white dark:bg-gray-800'
                }`}
              >
                <CardContent>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <Typography variant="subtitle1">
                      {budget.description ||
                        (budget.category as any)?.name ||
                        'Budget'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatMoney(budget.currentSpent)} of{' '}
                      {formatMoney(budget.amount)}
                    </Typography>
                  </div>
                  <BudgetProgressBar value={budget.percentUsed} />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    className="mt-1 block"
                  >
                    {budget.isExceeded
                      ? `Exceeded by ${formatMoney(budget.currentSpent - budget.amount)}`
                      : `${formatMoney(budget.remaining)} remaining until ${new Date(budget.endDate).toLocaleDateString()}`}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Account Balances Section */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Account Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.accounts.map((account: any) => (
            <Card
              key={account.id}
              className="bg-white dark:bg-gray-800 shadow-sm"
            >
              <CardContent>
                <Typography variant="subtitle1" className="mb-1">
                  {account.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-2"
                >
                  {account.type}
                </Typography>
                <Typography variant="h6">
                  {formatMoney(account.balance)} {account.currency}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Transactions Table */}
      <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
      <OverviewTransactionTable
        transactions={recentTransactions}
        onTransactionClick={setSelectedTransaction}
      />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default Overview;

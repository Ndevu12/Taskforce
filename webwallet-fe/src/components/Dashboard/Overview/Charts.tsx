import React from 'react';
import ChartCard from '../../cards/ChartCard';
import {
  TransactionResponse,
  TransactionType,
} from '../../../types/interfaces/ITransaction';
import formatMoney from '../../../utils/formatMoney';

interface ChartsProps {
  transactions?: TransactionResponse[];
  analyticsData?: any;
  className?: string;
}

const Charts: React.FC<ChartsProps> = ({
  transactions = [],
  analyticsData,
  className = '',
}) => {
  // Helper function to derive transaction type from category name
  const getTransactionTypeFromCategory = (
    categoryName: string,
  ): TransactionType => {
    if (!categoryName) return TransactionType.EXPENSE;

    const normalizedName = categoryName.toUpperCase().trim();

    switch (normalizedName) {
      case 'INCOME':
        return TransactionType.INCOME;
      case 'SAVING':
      case 'SAVINGS':
        return TransactionType.SAVINGS;
      case 'INVESTMENT':
        return TransactionType.INVESTMENT;
      case 'DEBT':
        return TransactionType.DEBT;
      case 'CREDIT':
        return TransactionType.CREDIT;
      case 'EXPENSE':
      default:
        return TransactionType.EXPENSE;
    }
  };

  // If analytics data is provided, use it to generate the charts
  if (analyticsData) {
    const { spendingByCategory, incomeExpense, accounts } = analyticsData;

    // Define consistent colors for categories with proper typing
    const categoryColors: Record<string, string | string[]> = {
      // Income categories
      Income: '#36A2EB',
      Salary: '#45C1A4',
      Freelance: '#9966FF',
      Business: '#FF9F40',

      // Expense categories
      Expense: '#FF6384',
      Food: '#FFCE56',
      Transport: '#4BC0C0',
      Housing: '#FF9F40',
      Utilities: '#9966FF',
      Entertainment: '#8AC926',
      Shopping: '#FF8C42',
      Health: '#6A4C93',
      Education: '#1982C4',

      // Other transaction types
      Savings: '#36A2EB',
      Investment: '#9966FF',
      Debt: '#FF6384',
      Credit: '#FFCE56',

      // Default colors for other categories
      default: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#8AC926',
        '#1982C4',
        '#6A4C93',
        '#F94144',
      ],
    };

    // Function to assign colors to categories consistently with type safety
    const getCategoryColor = (category: string, index: number): string => {
      const color = categoryColors[category];
      // If it's a string, return it directly
      if (typeof color === 'string') {
        return color;
      }
      // If it's an array (the default colors), access by index
      if (Array.isArray(color)) {
        return color[index % color.length];
      }
      // Ultimate fallback to a safe default color
      const defaultColors = categoryColors['default'] as string[];
      return defaultColors[index % defaultColors.length];
    };

    // Prepare chart data for spending by category
    const categoryNames = Object.keys(spendingByCategory || {});
    const spendingChartData = {
      labels: categoryNames,
      datasets: [
        {
          data: Object.values(spendingByCategory || {}),
          backgroundColor: categoryNames.map((category, index) =>
            getCategoryColor(category, index),
          ),
          hoverBackgroundColor: categoryNames.map((category, index) =>
            getCategoryColor(category, index),
          ),
        },
      ],
    };

    // Format dates for better readability
    const formatChartDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // Prepare chart data for income vs expenses trend
    const incomeVsExpenseData = {
      labels: (incomeExpense?.dailyTransactions || []).map((day: any) =>
        formatChartDate(day.date),
      ),
      datasets: [
        {
          label: 'Income',
          data: (incomeExpense?.dailyTransactions || []).map(
            (day: any) => day.income || 0,
          ),
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: (incomeExpense?.dailyTransactions || []).map(
            (day: any) => day.expense || 0,
          ),
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // Account distribution chart showing account types and balances
    // First, ensure accountsByType data exists and extract it properly
    const accountsByType = accounts?.accountsByType || {};

    // Normalize account type keys (handle different casings)
    const normalizedAccountsByType: Record<string, number> = {};
    Object.entries(accountsByType).forEach(([type, balance]) => {
      const normalizedType = type.toUpperCase();
      normalizedAccountsByType[normalizedType] = Number(balance) || 0;
    });

    // Define all possible account types to ensure they all appear in the chart
    const allAccountTypes = [
      'BANK',
      'CASH',
      'MOBILE_MONEY',
      'CREDIT',
      'INVESTMENT',
      'SAVINGS',
    ];

    // Create labels and data arrays ensuring all account types are included
    const accountTypeLabels: string[] = [];
    const accountBalances: number[] = [];

    allAccountTypes.forEach((type) => {
      // Only include account types with balance > 0 or that exist in the data
      if (normalizedAccountsByType[type] !== undefined) {
        let displayLabel;
        switch (type) {
          case 'BANK':
            displayLabel = 'Bank Account';
            break;
          case 'CASH':
            displayLabel = 'Cash';
            break;
          case 'MOBILE_MONEY':
            displayLabel = 'Mobile Money';
            break;
          case 'CREDIT':
            displayLabel = 'Credit';
            break;
          case 'INVESTMENT':
            displayLabel = 'Investment';
            break;
          case 'SAVINGS':
            displayLabel = 'Savings';
            break;
          default:
            displayLabel = type;
        }
        accountTypeLabels.push(displayLabel);
        accountBalances.push(normalizedAccountsByType[type]);
      }
    });

    // Colors for account types
    const accountTypeColors = {
      'Bank Account': '#4BC0C0',
      Cash: '#FFCE56',
      'Mobile Money': '#36A2EB',
      Credit: '#FF6384',
      Investment: '#9966FF',
      Savings: '#45C1A4',
      Default: '#FF9F40',
    };

    const accountDistributionData = {
      labels: accountTypeLabels,
      datasets: [
        {
          data: accountBalances,
          backgroundColor: accountTypeLabels.map(
            (label) =>
              accountTypeColors[label as keyof typeof accountTypeColors] ||
              accountTypeColors.Default,
          ),
          hoverBackgroundColor: accountTypeLabels.map(
            (label) =>
              accountTypeColors[label as keyof typeof accountTypeColors] ||
              accountTypeColors.Default,
          ),
        },
      ],
    };

    // Custom chart options with better tooltips
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || '';
              const value = context.raw || 0;
              return `${label ? label + ': ' : ''}${formatMoney(value, 'RWF')}`;
            },
          },
        },
        legend: {
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
      },
    };

    // Add dark mode support for charts
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#e5e7eb' : '#374151';
    const gridColor = isDarkMode
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)';

    const lineChartOptions = {
      ...chartOptions,
      scales: {
        x: {
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
          },
        },
        y: {
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
            callback: function (value: any) {
              return formatMoney(value, 'RWF');
            },
          },
        },
      },
    };

    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
        <ChartCard
          title="Income vs Expenses Trend"
          type="line"
          data={incomeVsExpenseData}
          options={lineChartOptions}
          className="h-full"
          height="h-72"
          description="Daily income and expense trends for the current month"
        />
        <ChartCard
          title="Spending by Category"
          type="doughnut"
          data={spendingChartData}
          options={chartOptions}
          className="h-full"
          height="h-72"
          description="Distribution of expenses across different categories"
        />
        <ChartCard
          title="Account Distribution"
          type="doughnut"
          data={accountDistributionData}
          options={chartOptions}
          className="h-full"
          height="h-72"
          description="Distribution of funds across different account types"
        />
      </div>
    );
  }

  // Fallback: If no analytics data, process transactions to show charts
  if (transactions.length > 0) {
    // Group transactions by category
    const processedTransactions = transactions.map((transaction) => {
      const categoryName = transaction.category?.name || 'Uncategorized';
      const type = getTransactionTypeFromCategory(categoryName);
      return { ...transaction, type };
    });

    // Group data for charts
    const transactionsByCategory = processedTransactions.reduce(
      (result: any, transaction) => {
        const categoryName = transaction.category?.name || 'Uncategorized';
        if (!result[categoryName]) {
          result[categoryName] = 0;
        }
        result[categoryName] += transaction.amount;
        return result;
      },
      {},
    );

    // Create simple chart data
    const categoryChartData = {
      labels: Object.keys(transactionsByCategory),
      datasets: [
        {
          data: Object.values(transactionsByCategory),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#8AC926',
            '#1982C4',
            '#6A4C93',
            '#F94144',
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className={`flex flex-wrap gap-4 ${className}`}>
        <ChartCard
          title="Transactions by Category"
          type="doughnut"
          data={categoryChartData}
          description="Distribution of transactions across categories"
        />
      </div>
    );
  }

  // No data available
  return (
    <div
      className={`p-6 text-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
    >
      <p className="text-gray-500 dark:text-gray-400">
        No transaction data available to generate charts.
      </p>
    </div>
  );
};

export default Charts;

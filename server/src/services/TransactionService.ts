import Transaction from '../models/Transaction';
import { ITransaction } from '../types/interfaces/ITransaction';

export const createTransaction = async (transactionData: ITransaction) => {
  const transaction = new Transaction(transactionData);
  const savedTransaction = await transaction.save();
  return savedTransaction;
};

export const getTransactionsByUser = async (userId: string) => {
  return await Transaction.find({ user: userId }).populate('account category');
};

export const getTransactionById = async (transactionId: string) => {
  return await Transaction.findById(transactionId).populate('account category');
};

export const updateTransactionById = async (transactionId: string, updateData: Partial<ITransaction>) => {
  const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, updateData, { new: true });
  return updatedTransaction;
};

export const deleteTransactionById = async (transactionId: string) => {
  return await Transaction.findByIdAndDelete(transactionId);
};

export const getTransactionsSummary = async (userId: string) => {
  const transactions: ITransaction[] = await Transaction.find({ user: userId }).populate('category');

  const summary = transactions.reduce((acc, transaction) => {
    const { type, amount, category, date } = transaction as ITransaction & { category: { name: string } };

    if (!acc.amounts[type]) {
      acc.amounts[type] = 0;
    }
    acc.amounts[type] += amount;

    const categoryName = category?.name || 'Unknown';
    if (!acc.categories[type]) {
      acc.categories[type] = {};
    }
    if (!acc.categories[type][categoryName]) {
      acc.categories[type][categoryName] = 0;
    }
    acc.categories[type][categoryName] += 1;

    const transactionDate = date.toISOString().split('T')[0];
    if (!acc.dates[transactionDate]) {
      acc.dates[transactionDate] = { total: 0, types: {} };
    }
    acc.dates[transactionDate].total += 1;
    if (!acc.dates[transactionDate].types[type]) {
      acc.dates[transactionDate].types[type] = 0;
    }
    acc.dates[transactionDate].types[type] += 1;

    return acc;
  }, {
    amounts: {} as Record<string, number>,
    categories: {} as Record<string, Record<string, number>>,
    dates: {} as Record<string, { total: number, types: Record<string, number> }>
  });

  const mostUsedCategories = Object.keys(summary.categories).reduce((acc, type) => {
    const categories = summary.categories[type];
    const mostUsedCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
    acc[type] = mostUsedCategory;
    return acc;
  }, {} as Record<string, string>);

  const highestTransactionDate = Object.keys(summary.dates).reduce((a, b) => summary.dates[a].total > summary.dates[b].total ? a : b, '');

  return {
    amounts: summary.amounts,
    mostUsedCategories,
    highestTransactionDate,
    highestTransactionDateDetails: summary.dates[highestTransactionDate],
    totalTransactions: transactions.length
  };
};
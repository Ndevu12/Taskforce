import mongoose from 'mongoose';
import Category from '../models/Category';

const defaultCategories = {
  EXPENSE: [
    'Housing',
    'Transportation',
    'Food',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Education',
    'Personal Care',
    'Other'
  ],
  INCOME: [
    'Salary',
    'Business',
    'Investment',
    'Gifts',
    'Other'
  ]
};

export const seedCategories = async () => {
  await Category.deleteMany({});
  for (const [type, names] of Object.entries(defaultCategories)) {
    for (const name of names) {
      await Category.create({ name, type, isDefault: true });
    }
  }
};

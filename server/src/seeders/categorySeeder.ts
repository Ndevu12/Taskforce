import mongoose from 'mongoose';
import Category from '../models/Category';
import SubCategory from '../models/SubCategory';
import { CategoryType } from '../types/enums/CategoryType';

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
  await SubCategory.deleteMany({}); // Clear existing subcategories

  for (const [type, names] of Object.entries(defaultCategories)) {
    for (const name of names) {
      const category = await Category.create({ name, type: type as CategoryType, isDefault: true });
      await SubCategory.create({ name, category: category._id, type: type as CategoryType, isDefault: true }); // Create subcategories
    }
  }
};

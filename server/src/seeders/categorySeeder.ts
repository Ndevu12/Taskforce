import mongoose from 'mongoose';
import Category from '../models/Category';

const defaultCategories = ["EXPENSE", "INCOME"];

export const seedCategories = async () => {
  await Category.deleteMany({});

  for (const name of defaultCategories) {
    await Category.create({ name });
  }
};

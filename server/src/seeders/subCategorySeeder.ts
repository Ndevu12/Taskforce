import mongoose from 'mongoose';
import connectDB from '../mongooseConfig';
import Category from '../models/Category';
import SubCategory from '../models/SubCategory';

const defaultSubCategories = {
  Housing: ['Rent', 'Mortgage'],
  Transportation: ['Gas', 'Public Transport'],
  Food: ['Groceries', 'Dining Out'],
  Utilities: ['Electricity', 'Water'],
  Healthcare: ['Insurance', 'Medication'],
  Entertainment: ['Movies', 'Concerts'],
  Shopping: ['Clothes', 'Electronics'],
  Education: ['Tuition', 'Books'],
  'Personal Care': ['Haircuts', 'Spa'],
  Other: ['Miscellaneous'],
  Salary: ['Monthly', 'Weekly'],
  Business: ['Sales', 'Services'],
  Investment: ['Stocks', 'Bonds'],
  Gifts: ['Birthday', 'Anniversary']
};

export const seedSubCategories = async () => {
  await connectDB();
  await SubCategory.deleteMany({});
  for (const [categoryName, subCategoryNames] of Object.entries(defaultSubCategories)) {
    const category = await Category.findOne({ name: categoryName });
    if (category) {
      for (const subCategoryName of subCategoryNames) {
        await SubCategory.create({ name: subCategoryName, category: category._id, isDefault: true });
      }
    }
  }
  mongoose.disconnect();
};
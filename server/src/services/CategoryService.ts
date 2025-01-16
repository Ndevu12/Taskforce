import Category from '../models/Category';
import { ICategory } from '../types/interfaces/ICategory';

export const createCategory = async (categoryData: ICategory) => {
  const category = new Category(categoryData);
  return await category.save();
};

export const getCategoriesByUser = async (userId: string) => {
  return await Category.find({ user: userId });
};

export const updateCategoryById = async (categoryId: string, updateData: Partial<ICategory>) => {
  return await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
};

export const deleteCategoryById = async (categoryId: string) => {
  return await Category.findByIdAndDelete(categoryId);
};

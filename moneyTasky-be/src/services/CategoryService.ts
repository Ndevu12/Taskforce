import Category from '../models/Category';
import { ICategory } from '../types/interfaces/ICategory';

export const createCategory = async (categoryData: ICategory) => {
  const category = new Category(categoryData);
  return await category.save();
};

export const getCategoryById = async (categoryId: string) => {
  return await Category.findById(categoryId);
}

export const getCategoryByName = async (categoryName: string) => {
  return await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
};

export const getCategories = async () => {
  return await Category.find();
};


export const updateCategoryById = async (categoryId: string, updateData: Partial<ICategory>) => {
  return await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
};

export const deleteCategoryById = async (categoryId: string) => {
  return await Category.findByIdAndDelete(categoryId);
};

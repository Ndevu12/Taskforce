import SubCategory from '../models/SubCategory';
import { ISubCategory } from '../types/interfaces/ISubCategory';

export const createSubCategory = async (subCategoryData: ISubCategory) => {
  const subCategory = new SubCategory(subCategoryData);
  return await subCategory.save();
};

export const getSubCategoriesByCategory = async (categoryId: string) => {
  return await SubCategory.find({ category: categoryId });
};

export const getSubCategoriesByCategoryName = async (categoryName: string) => {
  return await SubCategory.find({ category: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
};

export const getSubCategoryById = async (subCategoryId: string) => {
  return await SubCategory.findById(subCategoryId);
};

export const updateSubCategoryById = async (subCategoryId: string, updateData: Partial<ISubCategory>) => {
  return await SubCategory.findByIdAndUpdate(subCategoryId, updateData, { new: true });
};

export const deleteSubCategoryById = async (subCategoryId: string) => {
  return await SubCategory.findByIdAndDelete(subCategoryId);
};

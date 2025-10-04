import { Request, Response } from 'express';
import * as SubCategoryService from '../services/SubCategoryService';
import { getCategoryById, getCategoryByName } from '../services/CategoryService';
import logger from '../utils/logger';

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategory = await SubCategoryService.createSubCategory(req.body);
    res.status(201).json(subCategory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubCategoriesByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const subCategories = await SubCategoryService.getSubCategoriesByCategory(category._id as string);
    res.status(200).json(subCategories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubCategoriesByCategoryName = async (req: Request, res: Response) => {
  try {
    const categoryName = req.params.categoryName;
    if (!categoryName) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await getCategoryByName(categoryName);
    console.log({ category });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const subCategories = await SubCategoryService.getSubCategoriesByCategory(category._id as string);
    res.status(200).json(subCategories);
  } catch (error: any) {
    logger.error(`Failed to fetch subcategories: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getSubCategoryById = async (req: Request, res: Response) => {
  try {
    const subId = req.params.subCategoryId;
    if (!subId) {
      return res.status(400).json({ error: 'SubCategory ID is required' });
    }

    const subCategory = await SubCategoryService.getSubCategoryById(subId);
    if (!subCategory) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }
    res.status(200).json(subCategory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubCategoryById = async (req: Request, res: Response) => {
  try {
    const subCategory = await SubCategoryService.updateSubCategoryById(req.params.subCategoryId, req.body);
    if (!subCategory) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }
    res.status(200).json(subCategory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubCategoryById = async (req: Request, res: Response) => {
  try {
    const subCategory = await SubCategoryService.deleteSubCategoryById(req.params.subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

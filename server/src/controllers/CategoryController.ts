import { Request, Response } from 'express';
import * as CategoryService from '../services/CategoryService';
import { validateCategoryInput, validateCategoryUpdateInput } from '../helpers/validators/CategoryValidator';
import logger from '../utils/logger';

export const createCategory = async (req: Request, res: Response) => {
  const { error } = validateCategoryInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const categoryData = { ...req.body };
    const category = await CategoryService.createCategory(categoryData);
    res.status(201).json(category);
  } catch (error: any) {
    logger.error(`Failed to create category: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    logger.error(`Failed to fetch categories: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (error: any) {
    logger.error(`Failed to fetch category: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateCategoryById = async (req: Request, res: Response) => {
  const { error } = validateCategoryUpdateInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const category = await CategoryService.updateCategoryById(req.params.categoryId, req.body);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.deleteCategoryById(req.params.categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
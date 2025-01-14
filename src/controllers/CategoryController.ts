import { Request, Response } from 'express';
import * as CategoryService from '../services/CategoryService';
import { validateCategoryInput } from '../helpers/validators/CategoryValidator';

export const createCategory = async (req: Request, res: Response) => {
  const { error } = validateCategoryInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoriesByUser = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getCategoriesByUser(req.params.userId);
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategoryById = async (req: Request, res: Response) => {
  const { error } = validateCategoryInput(req.body);
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
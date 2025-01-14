import { Request, Response } from 'express';
import * as SubCategoryService from '../services/SubCategoryService';
import { validateSubCategoryInput } from '../helpers/validators/SubCategoryValidator';

export const createSubCategory = async (req: Request, res: Response) => {
  const { error } = validateSubCategoryInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const subCategory = await SubCategoryService.createSubCategory(req.body);
    res.status(201).json(subCategory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubCategoriesByCategory = async (req: Request, res: Response) => {
  try {
    const subCategories = await SubCategoryService.getSubCategoriesByCategory(req.params.categoryId);
    res.status(200).json(subCategories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubCategoryById = async (req: Request, res: Response) => {
  const { error } = validateSubCategoryInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const subCategory = await SubCategoryService.updateSubCategoryById(req.params.subCategoryId, req.body);
    if (!subCategory) return res.status(404).json({ error: 'SubCategory not found' });
    res.status(200).json(subCategory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubCategoryById = async (req: Request, res: Response) => {
  try {
    const subCategory = await SubCategoryService.deleteSubCategoryById(req.params.subCategoryId);
    if (!subCategory) return res.status(404).json({ error: 'SubCategory not found' });
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

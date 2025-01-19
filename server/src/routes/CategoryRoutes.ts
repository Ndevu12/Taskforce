import { Router } from 'express';
import * as CategoryController from '../controllers/CategoryController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, CategoryController.createCategory);
router.put('/:categoryId', isAuth, CategoryController.updateCategoryById);
router.delete('/:categoryId', isAuth, CategoryController.deleteCategoryById);
router.get('/', isAuth, CategoryController.getCategories);
router.get('/:categoryId', isAuth, CategoryController.getCategoryById);

export default router;

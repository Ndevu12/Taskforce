import { Router } from 'express';
import * as CategoryController from '../controllers/CategoryController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, CategoryController.createCategory);
router.get('/user/:userId', isAuth, CategoryController.getCategoriesByUser);
router.put('/:categoryId', isAuth, CategoryController.updateCategoryById);
router.delete('/:categoryId', isAuth, CategoryController.deleteCategoryById);

export default router;
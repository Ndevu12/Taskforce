import { Router } from 'express';
import * as SubCategoryController from '../controllers/SubCategoryController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, SubCategoryController.createSubCategory);
router.get('/category/:categoryId', isAuth, SubCategoryController.getSubCategoriesByCategory);
router.put('/:subCategoryId', isAuth, SubCategoryController.updateSubCategoryById);
router.delete('/:subCategoryId', isAuth, SubCategoryController.deleteSubCategoryById);

export default router;

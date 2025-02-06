import { Router } from "express";
import * as SubCategoriesController from "../controllers/SubCategoriesController";
import { isAuth } from "../middleware/isAuth";

const router = Router();

router.post("/", isAuth, SubCategoriesController.createSubCategory);
router.get("/category/:categoryId", isAuth, SubCategoriesController.getSubCategoriesByCategory);
router.get("/category/name/:categoryName", isAuth, SubCategoriesController.getSubCategoriesByCategoryName);
router.get("/:subCategoryId", isAuth, SubCategoriesController.getSubCategoryById);
router.put("/:subCategoryId", isAuth, SubCategoriesController.updateSubCategoryById);
router.delete("/:subCategoryId", isAuth, SubCategoriesController.deleteSubCategoryById);

export default router;
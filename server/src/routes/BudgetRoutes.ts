import { Router } from 'express';
import * as BudgetController from '../controllers/BudgetController';
import { isAuth }from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, BudgetController.createBudget);
router.get('/user', isAuth, BudgetController.getBudgetsByUser);
router.put('/:budgetId', isAuth, BudgetController.updateBudgetById);
router.delete('/:budgetId', isAuth, BudgetController.deleteBudgetById);

export default router;
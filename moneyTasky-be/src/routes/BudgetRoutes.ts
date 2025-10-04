import { Router } from 'express';
import * as BudgetController from '../controllers/BudgetController';
import { isAuth }from '../middleware/isAuth';

const router = Router();

/**
 * @route   POST /budgets
 * @desc    Create a new budget
 * @access  Private
 */
router.post('/', isAuth, BudgetController.createBudget);

/**
 * @route   GET /budgets/user
 * @desc    Get all budgets for the authenticated user
 * @access  Private
 */
router.get('/user', isAuth, BudgetController.getBudgetsByUser);

/**
 * @route   GET /budgets/:budgetId
 * @desc    Get a budget by ID
 * @access  Private
 */
router.get('/:budgetId', isAuth, BudgetController.getBudgetById);

/**
 * @route   PUT /budgets/:budgetId
 * @desc    Update an existing budget
 * @access  Private
 */
router.put('/:budgetId', isAuth, BudgetController.updateBudgetById);

/**
 * @route   DELETE /budgets/:budgetId
 * @desc    Delete a budget by ID
 * @access  Private
 */
router.delete('/:budgetId', isAuth, BudgetController.deleteBudgetById);

export default router;
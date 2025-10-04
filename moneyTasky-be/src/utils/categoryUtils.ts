import { TransactionType } from '../types/enums/TransactionType';
import Category from '../models/Category';

/**
 * Gets the transaction type from a category ID
 */
export const getTransactionTypeFromCategoryId = async (categoryId: string): Promise<TransactionType> => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    
    return getTransactionTypeFromCategoryName(category.name);
  } catch (error) {
    console.error('Error determining transaction type from category:', error);
    return TransactionType.EXPENSE; // Default fallback
  }
};

/**
 * Gets the transaction type from a category name
 */
export const getTransactionTypeFromCategoryName = (categoryName: string): TransactionType => {
  // Standardize the category name for comparison
  const normalizedName = categoryName.toUpperCase().trim();
  
  switch (normalizedName) {
    case 'INCOME':
      return TransactionType.INCOME;
    case 'SAVING':
    case 'SAVINGS':
      return TransactionType.SAVINGS;
    case 'INVESTMENT':
      return TransactionType.INVESTMENT;
    case 'DEBT':
      return TransactionType.DEBT;
    case 'CREDIT':
      return TransactionType.CREDIT;
    case 'EXPENSE':
    default:
      return TransactionType.EXPENSE;
  }
};

/**
 * Checks if a category represents an expense type
 */
export const isExpenseCategory = async (categoryId: string): Promise<boolean> => {
  const transactionType = await getTransactionTypeFromCategoryId(categoryId);
  return transactionType === TransactionType.EXPENSE;
};

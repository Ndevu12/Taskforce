import mongoose from 'mongoose';
import logger from './logger';

/**
 * Validates if a string is a valid MongoDB ObjectId
 * 
 * @param id The string to validate
 * @returns boolean indicating if the string is a valid ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  try {
    return mongoose.Types.ObjectId.isValid(id);
  } catch (error) {
    logger.error(`Error validating ObjectId: ${id}`, error);
    return false;
  }
};

/**
 * Validates an array of IDs and returns only the valid MongoDB ObjectIds
 * 
 * @param ids Array of string IDs to validate
 * @returns Array of valid ID strings
 */
export const filterValidObjectIds = (ids: string[]): string[] => {
  return ids.filter(id => isValidObjectId(id));
};

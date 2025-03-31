import logger from './logger';

/**
 * Safely extracts an owner ID from an object that might have a user field
 * that could be either an object or a string ID
 * 
 * @param item Any object with a user field (document from MongoDB)
 * @returns The user ID as a string
 * @throws Error if the extraction fails
 */
export const extractOwnerId = (item: any): string => {
  try {
    if (!item || !item.user) {
      throw new Error('Invalid item or missing user field');
    }
    
    // Handle case where user is populated (is an object)
    if (typeof item.user === 'object') {
      const userObj = item.user;
      // Object might have _id (mongoose document) or be ObjectId itself
      return userObj._id ? userObj._id.toString() : userObj.toString();
    }
    
    // Handle case where user is just the ID string/ObjectId
    return String(item.user);
  } catch (err) {
    logger.error(`Error extracting owner ID: ${err}`);
    throw new Error('Failed to verify item ownership');
  }
};

/**
 * Checks if the current user is the owner of an item
 * 
 * @param item Any object with a user field (document from MongoDB)
 * @param currentUserId The ID of the current user
 * @returns boolean indicating if the current user is the owner
 * @throws Error if the check fails
 */
export const isOwner = (item: any, currentUserId: string): boolean => {
  const ownerId = extractOwnerId(item);
  return ownerId === currentUserId;
};

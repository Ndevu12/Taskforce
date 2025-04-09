import User from '../models/User';
import { hashedPassword } from '../helpers/bycrptHashingManager';
import { IUser } from '../types';
import { sendVerificationEmail } from './AuthService';
import { sendWelcomeEmail } from '../helpers/emailHandlers/emailHandlers';
import logger from '../utils/logger';

export const createUser = async (userData: IUser) => {
    try {
        const hashed = await hashedPassword(userData.password);
        if (hashed) {
            userData.password = hashed;
        }
        const user = new User(userData);
        const savedUser = await user.save();
        
        // Send verification email
        await sendVerificationEmail(
            (savedUser._id as string).toString(), 
            savedUser.email, 
            savedUser.name
        );
        
        // Send welcome email
        await sendWelcomeEmail(savedUser.name, savedUser.email);
        
        return savedUser;
    } catch (error) {
        logger.error('Error creating user:', error);
        throw error;
    }
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};

export const findUserByName = async (name: string) => {
  return await User.findOne({ name });
};

export const updateUserById = async (id: string, updateData: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUserById = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

/**
 * Find all users with verified email accounts
 * @returns Array of verified users
 */
export const findAllVerifiedUsers = async () => {
  try {
    return await User.find({ isVerified: true });
  } catch (error) {
    logger.error('Error finding verified users:', error);
    throw error;
  }
};
import User from '../models/User';
import { comparePassword, hashedPassword } from '../helpers/bycrptHashingManager';
import { generateToken, expireToken } from '../helpers/jwtTokenManager';
import logger from '../utils/logger';
import crypto from 'crypto';
import { sendAccountVerificationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '../helpers/emailHandlers/emailHandlers';

export const authenticateUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        logger.debug('User not found by email, in auth service.')
        throw new Error('Invalid credentials.');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        logger.debug('Password not match.')
        throw new Error('Invalid credentials.');
    }

    // Check if user is verified
    if (!user.isVerified) {
        throw new Error('Please verify your email before logging in.');
    }

    const token = generateToken({ userId: user._id, email: user.email, name: user.name, role: user.role });
    if (!token) {
        logger.debug('Failed to generate token.')
        return;
    }
    return { token };
};

export const logoutUser = (token: string) => {
    expireToken(token);
};

/**
 * Generate verification token and send verification email
 * 
 * @param userId User ID
 * @param email User's email
 * @param name User's name
 * @returns Success status
 */
export const sendVerificationEmail = async (userId: string, email: string, name: string): Promise<boolean> => {
    try {
        // Generate a random verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        // Set expiration to 24 hours from now
        const verificationExpires = new Date();
        verificationExpires.setHours(verificationExpires.getHours() + 24);
        
        // Update user with verification token
        await User.findByIdAndUpdate(userId, {
            verificationToken,
            verificationExpires
        });
        
        // Create verification URL
        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
        const verificationUrl = `${CLIENT_URL}/verify-email?token=${verificationToken}&userId=${userId}`;
        
        // Send verification email
        const result = await sendAccountVerificationEmail(name, email, verificationToken, verificationUrl);
        
        return result;
    } catch (error) {
        logger.error('Error sending verification email:', error);
        return false;
    }
};

/**
 * Verify a user's email using a verification token
 * 
 * @param userId User ID
 * @param token Verification token
 * @returns Success status and message
 */
export const verifyEmail = async (
    userId: string, 
    token: string
): Promise<{ success: boolean, message: string }> => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        if (user.isVerified) {
            return { success: true, message: 'Email already verified' };
        }
        
        if (!user.verificationToken || user.verificationToken !== token) {
            return { success: false, message: 'Invalid verification token' };
        }
        
        if (user.verificationExpires && user.verificationExpires < new Date()) {
            return { success: false, message: 'Verification token has expired' };
        }
        
        // Mark user as verified and clear verification fields
        await User.findByIdAndUpdate(userId, {
            isVerified: true,
            verificationToken: null,
            verificationExpires: null
        });
        
        return { success: true, message: 'Email verified successfully' };
    } catch (error) {
        logger.error('Error verifying email:', error);
        return { success: false, message: 'An error occurred during verification' };
    }
};

/**
 * Resend verification email
 * 
 * @param email User's email
 * @returns Success status and message
 */
export const resendVerificationEmail = async (
    email: string
): Promise<{ success: boolean, message: string }> => {
    try {
        const user = await User.findOne({ email }) as {_id: string, isVerified: boolean, name: string, email: string};
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        if (user.isVerified) {
            return { success: true, message: 'Email already verified' };
        }
        
        // Send new verification email
        const sent = await sendVerificationEmail(
            user._id.toString(), 
            user.email, 
            user.name
        );
        
        if (sent) {
            return { 
                success: true, 
                message: 'Verification email sent successfully'
            };
        } else {
            return {
                success: false,
                message: 'Failed to send verification email'
            };
        }
    } catch (error) {
        logger.error('Error resending verification email:', error);
        return { 
            success: false, 
            message: 'An error occurred while resending verification email'
        };
    }
};

/**
 * Generate and send password reset token
 * 
 * @param email User's email
 * @returns Success status and message
 */
export const sendPasswordResetToken = async (
    email: string
): Promise<{ success: boolean, message: string }> => {
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return { 
                success: false, 
                message: 'User not found' 
            };
        }
        
        // Generate a random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Set expiration to 1 hour from now
        const resetTokenExpires = new Date();
        resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);
        
        // Update user with reset token
        await User.findByIdAndUpdate(user._id, {
            resetToken,
            resetTokenExpires
        });
        
        // Create reset URL
        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
        const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}&userId=${user._id}`;
        
        // Send password reset email
        const result = await sendPasswordResetEmail(
            user.name, 
            user.email, 
            resetToken, 
            resetUrl
        );
        
        if (result) {
            return { 
                success: true, 
                message: 'Password reset instructions sent to your email'
            };
        } else {
            return {
                success: false,
                message: 'Failed to send password reset email'
            };
        }
    } catch (error) {
        logger.error('Error sending password reset token:', error);
        return { 
            success: false, 
            message: 'An error occurred while processing your request'
        };
    }
};

/**
 * Reset user password using token
 * 
 * @param userId User ID
 * @param token Reset token
 * @param newPassword New password
 * @returns Success status and message
 */
export const resetUserPassword = async (
    userId: string,
    token: string,
    newPassword: string
): Promise<{ success: boolean, message: string }> => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        if (!user.resetToken || user.resetToken !== token) {
            return { success: false, message: 'Invalid reset token' };
        }
        
        if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
            return { success: false, message: 'Reset token has expired' };
        }
        
        // Hash the new password
        const hashedNewPassword = await hashedPassword(newPassword);
        
        // Update password and clear reset token fields
        await User.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
            resetToken: null,
            resetTokenExpires: null
        });

        try {
        await sendPasswordResetSuccessEmail(user.name, user.email);
        } catch (error) {
            logger.error('Error sending password reset success email');
        }
        
        return { success: true, message: 'Password has been reset successfully' };
    } catch (error) {
        logger.error('Error resetting password:', error);
        return { success: false, message: 'An error occurred while resetting password' };
    }
};

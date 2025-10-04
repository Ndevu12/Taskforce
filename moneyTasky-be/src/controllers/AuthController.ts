import { Request, Response } from 'express';
import * as AuthService from '../services/AuthService';
import { findUserByEmail } from '../services/UserService';
import logger from '../utils/logger';
import Joi from 'joi';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const authResult = await AuthService.authenticateUser(email, password);
        if (!authResult) {
            return res.status(500).json({ message: 'Sorry, Something went wrong. Try again later!' });
        }
        const { token } = authResult;

        res.status(200).json({ message: "User logged in successfully!", token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
           return res.status(401).json({ message: 'Bearer token is required' });
        }
        const token = authHeader.split(" ")[1];
        await AuthService.logoutUser(token);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Verify user email
 */
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { userId, token } = req.query;
        
        if (!userId || !token) {
            return res.status(400).json({ 
                error: 'User ID and verification token are required' 
            });
        }
        
        const result = await AuthService.verifyEmail(
            userId.toString(), 
            token.toString()
        );
        
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(400).json({ error: result.message });
        }
    } catch (error) {
        logger.error('Error verifying email:', error);
        res.status(500).json({ error: 'Failed to verify email' });
    }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        const result = await AuthService.resendVerificationEmail(email);
        
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(400).json({ error: result.message });
        }
    } catch (error) {
        logger.error('Error resending verification email:', error);
        res.status(500).json({ error: 'Failed to resend verification email' });
    }
};

/**
 * Request a password reset
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        const result = await AuthService.sendPasswordResetToken(email);
        
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            // Always return success even if email not found for security reasons
            return res.status(200).json({ 
                message: 'If your email is registered, you will receive password reset instructions.'
            });
        }
    } catch (error) {
        logger.error('Error requesting password reset:', error);
        res.status(500).json({ error: 'Failed to process password reset request' });
    }
};

/**
 * Reset password using token
 */
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, userId, newPassword } = req.body;
        
        // Validate inputs
        if (!token || !userId || !newPassword) {
            return res.status(400).json({ 
                error: 'Token, user ID and new password are required' 
            });
        }
        
        // Password validation
        const passwordSchema = Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            });
            
        const { error } = passwordSchema.validate(newPassword);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        
        const result = await AuthService.resetUserPassword(
            userId.toString(), 
            token.toString(),
            newPassword
        );
        
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(400).json({ error: result.message });
        }
    } catch (error) {
        logger.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

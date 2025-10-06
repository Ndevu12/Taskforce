import { RequestHandler, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import 'dotenv/config';
import mongoose from 'mongoose';
import User from "../models/User";
import { IUser } from '../types/interfaces/IUser';
import logger from "../utils/logger";
import { verifyToken } from "../helpers/jwtTokenManager";
import { UserRole } from "../types/enums/UserRole";
import { AccountStatus } from "../types/enums/AccountStatus";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: mongoose.Document<unknown, {}, IUser> & IUser & { _id: mongoose.Types.ObjectId };
            role?: UserRole;
            accountStatus?: AccountStatus;
        }
    }
}

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and adds user data to request
 */
export const isAuth: RequestHandler = async (req, res, next) => {
    try {
        const header = req.get('Authorization');

        if (!header) {
            return res.status(401).json({ 
                message: "Authentication required. Please log in to access this resource.",
                code: "AUTH_HEADER_MISSING" 
            });
        }

        // Extract token from Authorization header
        const token = header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                message: "Invalid authentication format. Use 'Bearer <token>'.",
                code: "INVALID_AUTH_FORMAT"
            });
        }

        // Verify JWT token
        const decodedToken = verifyToken(token) as JwtPayload;
        if (!decodedToken) {
            return res.status(401).json({ 
                message: "Your session has expired or is invalid. Please log in again.",
                code: "TOKEN_INVALID" 
            });
        }

        // Find the user in database
        req.userId = decodedToken.userId;
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            logger.warn(`Authentication failed: User ID ${decodedToken.userId} not found in database`);
            return res.status(404).json({ 
                message: "User account not found. Please contact support if you believe this is an error.",
                code: "USER_NOT_FOUND"
            });
        }

        // Check if user's email is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email before accessing this resource.",
                code: "EMAIL_NOT_VERIFIED"
            });
        }

        // Check account status with new enum
        if (user.accountStatus !== AccountStatus.ACTIVE) {
            
            let message = "Your account is currently not active.";
            let code = "ACCOUNT_INACTIVE";
            
            if (user.accountStatus === AccountStatus.SUSPENDED) {
                message = "Your account has been suspended. " + (user.statusReason || "Please contact support for more information.");
                code = "ACCOUNT_SUSPENDED";
            } else if (user.accountStatus === AccountStatus.INACTIVE) {
                message = "Your account is inactive. Please reactivate your account to continue.";
                code = "ACCOUNT_INACTIVE";
            }
            
            return res.status(403).json({
                message,
                code,
                status: user.accountStatus
            });
        }

        // Add user info to request object
        req.user = user as mongoose.Document<unknown, {}, IUser> & IUser & { _id: mongoose.Types.ObjectId };
        req.role = user.role as UserRole;
        req.accountStatus = user.accountStatus;

        // Update last login time if it's been more than 1 hour since last update
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (!user.lastLogin || user.lastLogin < oneHourAgo) {
            await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
        }

        next();
    } catch (err) {
        const error = err as Error;
        
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid authentication token. Please log in again.',
                code: 'INVALID_TOKEN' 
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Your session has expired. Please log in again.',
                code: 'TOKEN_EXPIRED' 
            });
        } else {
            // Handle other errors
            res.status(500).json({ 
                message: "Authentication failed due to a server error. Please try again later.",
                code: "AUTH_SERVER_ERROR"
            });
        }
    }
};

/**
 * Admin authentication middleware
 * Ensures only users with ADMIN role can access protected routes
 */
export const isAdminAuth: RequestHandler = async (req, res, next) => {
    try {
        const header = req.get('Authorization');

        if (!header) {
            return res.status(401).json({ 
                message: "Authentication required. Please log in to access this resource.",
                code: "AUTH_HEADER_MISSING"
            });
        }

        const token = header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                message: "Invalid authentication format. Use 'Bearer <token>'.",
                code: "INVALID_AUTH_FORMAT"
            });
        }

        // Use same token verification as regular auth
        const decodedToken = verifyToken(token) as JwtPayload;

        if (!decodedToken) {
            return res.status(401).json({ 
                message: "Your session has expired or is invalid. Please log in again.",
                code: "TOKEN_INVALID"
            });
        }

        req.userId = decodedToken.userId;
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({ 
                message: "User account not found.",
                code: "USER_NOT_FOUND" 
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email before accessing this resource.",
                code: "EMAIL_NOT_VERIFIED"
            });
        }

        // Check account status with new enum
        if (user.accountStatus !== AccountStatus.ACTIVE) {
            
            let message = "Your account is currently not active.";
            let code = "ACCOUNT_INACTIVE";
            
            if (user.accountStatus === AccountStatus.SUSPENDED) {
                message = "Your account has been suspended. " + (user.statusReason || "Please contact support for more information.");
                code = "ACCOUNT_SUSPENDED";
            } else if (user.accountStatus === AccountStatus.INACTIVE) {
                message = "Your account is inactive. Please reactivate your account to continue.";
                code = "ACCOUNT_INACTIVE";
            }
            
            return res.status(403).json({
                message,
                code,
                status: user.accountStatus
            });
        }

        // Verify admin role
        if (user.role !== UserRole.ADMIN) {
            return res.status(403).json({ 
                message: "You don't have permission to access this resource.",
                code: "INSUFFICIENT_PERMISSIONS" 
            });
        }

        req.user = user as mongoose.Document<unknown, {}, IUser> & IUser & { _id: mongoose.Types.ObjectId };
        req.role = UserRole.ADMIN;
        req.accountStatus = user.accountStatus;

        // Update last login time if it's been more than 1 hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (!user.lastLogin || user.lastLogin < oneHourAgo) {
            await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
        }
        
        next();
    } catch (err) {
        const error = err as Error;
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            res.status(401).json({ 
                message: 'Your session has expired or is invalid. Please log in again.',
                code: error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
            });
        } else {
            res.status(500).json({ 
                message: "Authentication failed due to a server error. Please try again later.",
                code: "AUTH_SERVER_ERROR"
            });
        }
    }
};
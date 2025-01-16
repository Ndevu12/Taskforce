import { RequestHandler, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import 'dotenv/config';
import mongoose from 'mongoose';
import User from "../models/User";
import { IUser } from '../types/interfaces/IUser';
import logger from "../utils/logger";
import { verifyToken } from "../helpers/token";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: mongoose.Document<unknown, {}, IUser> & IUser & { _id: mongoose.Types.ObjectId };
        }
    }
}

export const isAuth: RequestHandler = async (req, res, next) => {
    try {
        const header = req.get('Authorization');

        if (!header) {
            logger.info(' You\'re not authorized. No, header found.');
            return res.status(401).json({ message: "You're not authorized to do this action. Please, login first." });
        }

        const token = header.split(' ')[1];
        const decodedToken = await verifyToken(token) as JwtPayload;

        if (!decodedToken) {
            logger.info('Invalid or expired Token.');
            return res.status(401).json({ message: "Invalid or expired Token." });
        }

        req.userId = decodedToken.userId;
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user as mongoose.Document<unknown, {}, IUser> & IUser & { _id: mongoose.Types.ObjectId };

        next();
    } catch (err) {
        if ((err as Error).name === 'JsonWebTokenError' || (err as Error).name === 'TokenExpiredError') {
            logger.error('isAuth error: Token expired.', err);
            res.status(401).json({ message: 'Please, login again! Your token has been expired.', error: err });
        } else {
            logger.error('isAuth error: Server error.', err);
            res.status(500).json({ message: "Server error" });
        }
    }
}

export const isAdminAuth: RequestHandler = async (req, res, next) => {
    try {
        const header = req.get('Authorization');

        if (!header) {
            return res.status(401).json({ message: "You're not authorized" });
        }

        const token = header.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

        if (!decodedToken) {
            return res.status(401).json({ message: "You're not authorized" });
        }

        req.userId = decodedToken.userId;
        const user = await User.findById(decodedToken.userId);

        if (!user || user.role !== 'admin') {
            return res.status(404).json({ message: "Admin not found" });
        }

        next();
    } catch (err) {
        if ((err as Error).name === 'JsonWebTokenError' || (err as Error).name === 'TokenExpiredError') {
            res.status(401).json({ message: 'You\'re not authorized' });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }
}
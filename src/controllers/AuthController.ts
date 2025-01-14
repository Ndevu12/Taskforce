import { Request, Response } from 'express';
import * as AuthService from '../services/AuthService';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const { token, user } = await AuthService.authenticateUser(email, password);
        res.status(200).json({ token, user });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        if (!token) {
           return res.status(401).json({ message: 'Token is required' });
        }
        await AuthService.logoutUser(token);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

import { Request, Response } from 'express';
import * as AuthService from '../services/AuthService';

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

import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address'),
    body('password')
        .isString()
        .withMessage('Password must be a string'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

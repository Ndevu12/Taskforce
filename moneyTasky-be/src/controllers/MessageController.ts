import { Request, Response } from 'express';
import * as MessageService from '../services/MessageService';
import logger from '../utils/logger';
import { validateMessageInput } from '../helpers/validators/MessageValidator';

export const createMessage = async (req: Request, res: Response) => {
    const { error } = validateMessageInput(req.body);
    if (error) {
        logger.error(`Failed to create message: ${error.details[0].message}`);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const message = await MessageService.createMessage(req.body);
        res.status(201).json(message);
    } catch (error: any) {
        logger.error(`Failed to create message: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
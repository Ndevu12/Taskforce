import { Request, Response } from 'express';
import * as UserService from '../services/UserService';
import { validateUserInput } from '../helpers/validators/UserValidator';
import { validateUserUpdateInput } from '../helpers/validators/UserUpdateValidator';
import logger from '../utils/logger';

export const createUser = async (req: Request, res: Response) => {
  const { error } = validateUserInput(req.body);
  if (error) {
    logger.error(`Failed to create user: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { email, name } = req.body;
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or name already exists' });
    }

    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    console.log(`Failed to create user: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    if (!id) return res.status(400).json({ error: 'User ID is required' });
    
    const user = await UserService.findUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error: any) {
    console.log(`Failed to get user: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const { error } = validateUserUpdateInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const user = await UserService.updateUserById(req.params.userId, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error: any) {
    console.log(`Failed to update user: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserService.deleteUserById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(204).end();
  } catch (error: any) {
    console.log(`Failed to delete user: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

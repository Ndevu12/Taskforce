import { Request, Response } from 'express';
import * as FeedbackService from '../services/FeedbackService';
import { validateFeedbackInput, validateFeedbackUpdateInput, validateAdminFeedbackUpdateInput } from '../helpers/validators/FeedbackValidator';
import logger from '../utils/logger';
import mongoose from 'mongoose';
import { isOwner } from '../utils/ownershipUtils';

/**
 * Create new feedback
 */
export const createFeedback = async (req: Request, res: Response) => {
  const { error } = validateFeedbackInput(req.body);
  if (error) {
    logger.warn(`Feedback validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const feedbackData = {
      ...req.body,
      user: userId
    };

    const feedback = await FeedbackService.createFeedback(feedbackData);
    res.status(201).json({
      message: 'Feedback submitted successfully. Thank you for your input!',
      feedback
    });
  } catch (error: any) {
    logger.error(`Failed to create feedback: ${error.message}`);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

/**
 * Get feedback by ID - regular users can only access their own feedback
 */
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const { feedbackId } = req.params;
    if (!feedbackId || !mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback ID' });
    }

    const feedback = await FeedbackService.getFeedbackById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Check if user is the owner of this feedback
    if (!isOwner(feedback, userId)) {
      return res.status(403).json({ error: 'You do not have permission to view this feedback' });
    }

    res.status(200).json(feedback);
  } catch (error: any) {
    logger.error(`Error in getFeedbackById: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

/**
 * Get feedbacks by current user
 */
export const getFeedbacksByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const feedbacks = await FeedbackService.getFeedbacksByUser(userId);
    res.status(200).json(feedbacks);
  } catch (error: any) {
    logger.error(`Error in getFeedbacksByUser: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

/**
 * Update feedback - users can only update text of their own unresolved feedback
 */
export const updateFeedback = async (req: Request, res: Response) => {
  const { error } = validateFeedbackUpdateInput(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const { feedbackId } = req.params;
    if (!feedbackId || !mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback ID' });
    }

    // Get existing feedback to check ownership
    const existingFeedback = await FeedbackService.getFeedbackById(feedbackId);
    if (!existingFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Regular users can only update their own unresolved feedback
    if (!isOwner(existingFeedback, userId)) {
      return res.status(403).json({ error: 'You do not have permission to update this feedback' });
    }
    
    // Regular users can't mark feedback as resolved or add a response
    if (req.body.resolved !== undefined || req.body.response !== undefined) {
      return res.status(403).json({ error: 'Only administrators can resolve feedback or add responses' });
    }

    const updatedFeedback = await FeedbackService.updateFeedback(feedbackId, req.body);
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({
      message: 'Feedback updated successfully',
      feedback: updatedFeedback
    });
  } catch (error: any) {
    logger.error(`Error in updateFeedback: ${error.message}`);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
};

/**
 * Delete feedback (owner only)
 */
export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const { feedbackId } = req.params;
    if (!feedbackId || !mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback ID' });
    }

    // Get existing feedback to check ownership
    const existingFeedback = await FeedbackService.getFeedbackById(feedbackId);
    if (!existingFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Only feedback owner can delete using this endpoint
    if (!isOwner(existingFeedback, userId)) {
      return res.status(403).json({ error: 'You do not have permission to delete this feedback' });
    }

    const success = await FeedbackService.deleteFeedback(feedbackId);
    if (!success) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error: any) {
    logger.error(`Error in deleteFeedback: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};

// Admin-only controller functions

/**
 * Get all feedbacks (admin only)
 */
export const adminGetAllFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await FeedbackService.getAllFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error: any) {
    logger.error(`Error in adminGetAllFeedbacks: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch all feedbacks' });
  }
};

/**
 * Get feedback statistics (admin only)
 */
export const adminGetFeedbackStatistics = async (req: Request, res: Response) => {
  try {
    const statistics = await FeedbackService.getFeedbackStatistics();
    res.status(200).json(statistics);
  } catch (error: any) {
    logger.error(`Error in adminGetFeedbackStatistics: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch feedback statistics' });
  }
};

/**
 * Update feedback (admin only - can update any feedback)
 */
export const adminUpdateFeedback = async (req: Request, res: Response) => {
  const { error } = validateAdminFeedbackUpdateInput(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { feedbackId } = req.params;
    if (!feedbackId || !mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback ID' });
    }

    const existingFeedback = await FeedbackService.getFeedbackById(feedbackId);
    if (!existingFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const updatedFeedback = await FeedbackService.updateFeedback(feedbackId, req.body);
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({
      message: 'Feedback updated successfully',
      feedback: updatedFeedback
    });
  } catch (error: any) {
    logger.error(`Error in adminUpdateFeedback: ${error.message}`);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
};

/**
 * Delete feedback (admin only - can delete any feedback)
 */
export const adminDeleteFeedback = async (req: Request, res: Response) => {
  try {
    const { feedbackId } = req.params;
    if (!feedbackId || !mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback ID' });
    }

    const existingFeedback = await FeedbackService.getFeedbackById(feedbackId);
    if (!existingFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const success = await FeedbackService.deleteFeedback(feedbackId);
    if (!success) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error: any) {
    logger.error(`Error in adminDeleteFeedback: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};

/**
 * Get feedback by ID (admin only - can view any feedback)
 */
export const adminGetFeedbackById = async (req: Request, res: Response) => {
  try {
    const { feedbackId } = req.params;
    if (!feedbackId || !mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid feedback ID' });
    }

    const feedback = await FeedbackService.getFeedbackById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json(feedback);
  } catch (error: any) {
    logger.error(`Error in adminGetFeedbackById: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

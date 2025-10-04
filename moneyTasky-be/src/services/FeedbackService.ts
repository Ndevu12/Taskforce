import mongoose from 'mongoose';
import Feedback from '../models/Feedback';
import { IFeedback } from '../types/interfaces/IFeedback';
import logger from '../utils/logger';
import NotificationGatewayService from './NotificationGatewayService';

/**
 * Create new feedback
 * @param feedbackData Feedback data
 * @returns Created feedback
 */
export const createFeedback = async (feedbackData: Partial<IFeedback>): Promise<IFeedback> => {
  try {
    const feedback = new Feedback(feedbackData);
    const savedFeedback = await feedback.save();
    
    // Notify user that feedback was received
    await NotificationGatewayService.createSuccessNotification(
      savedFeedback.user.toString(),
      'Feedback Received',
      'Thank you for your feedback! We appreciate your input and will review it shortly.'
    );

    return savedFeedback;
  } catch (error) {
    logger.error(`Error creating feedback: ${error}`);
    throw error;
  }
};

/**
 * Get feedback by ID with validation
 * @param feedbackId Feedback ID
 * @returns Found feedback or null
 */
export const getFeedbackById = async (feedbackId: string): Promise<IFeedback | null> => {
  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    logger.warn(`Invalid feedback ID format: ${feedbackId}`);
    throw new Error('Invalid feedback ID format');
  }
  
  try {
    const feedback = await Feedback.findById(feedbackId).populate('user', 'name email');
    return feedback;
  } catch (error) {
    logger.error(`Error fetching feedback by ID: ${error}`);
    throw error;
  }
};

/**
 * Get all feedbacks by user
 * @param userId User ID
 * @returns Array of feedback
 */
export const getFeedbacksByUser = async (userId: string): Promise<IFeedback[]> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    logger.warn(`Invalid user ID provided to getFeedbacksByUser: ${userId}`);
    throw new Error('Invalid user ID format');
  }
  
  try {
    return await Feedback.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
  } catch (error) {
    logger.error(`Error fetching feedbacks for user ${userId}: ${error}`);
    throw error;
  }
};

/**
 * Get all feedbacks (admin only)
 * @returns Array of all feedback
 */
export const getAllFeedbacks = async (): Promise<IFeedback[]> => {
  try {
    return await Feedback.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
  } catch (error) {
    logger.error(`Error fetching all feedbacks: ${error}`);
    throw error;
  }
};

/**
 * Update feedback (typically for admin responses)
 * @param feedbackId Feedback ID
 * @param updateData Update data
 * @returns Updated feedback
 */
export const updateFeedback = async (
  feedbackId: string, 
  updateData: Partial<IFeedback>
): Promise<IFeedback | null> => {
  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    logger.warn(`Invalid feedback ID format: ${feedbackId}`);
    throw new Error('Invalid feedback ID format');
  }
  
  try {
    // Get current feedback to check if it's being resolved
    const currentFeedback = await Feedback.findById(feedbackId);
    if (!currentFeedback) {
      return null;
    }
    
    // Update feedback
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      updateData,
      { new: true }
    ).populate('user', 'name email');
    
    // If feedback is being resolved with a response, notify user
    if (
      updateData.resolved === true && 
      updateData.response && 
      currentFeedback.resolved === false &&
      updatedFeedback
    ) {
      await NotificationGatewayService.createSuccessNotification(
        updatedFeedback.user.toString(),
        'Feedback Response',
        `Your feedback has been addressed: "${updateData.response}"`
      );
    }
    
    return updatedFeedback;
  } catch (error) {
    logger.error(`Error updating feedback ${feedbackId}: ${error}`);
    throw error;
  }
};

/**
 * Delete feedback
 * @param feedbackId Feedback ID
 * @returns Success flag
 */
export const deleteFeedback = async (feedbackId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    logger.warn(`Invalid feedback ID format: ${feedbackId}`);
    throw new Error('Invalid feedback ID format');
  }
  
  try {
    const result = await Feedback.findByIdAndDelete(feedbackId);
    return !!result;
  } catch (error) {
    logger.error(`Error deleting feedback ${feedbackId}: ${error}`);
    throw error;
  }
};

/**
 * Get feedback statistics
 * @returns Feedback statistics
 */
export const getFeedbackStatistics = async () => {
  try {
    const totalCount = await Feedback.countDocuments({});
    const resolvedCount = await Feedback.countDocuments({ resolved: true });
    const unresolvedCount = await Feedback.countDocuments({ resolved: false });
    
    // Get counts by sentiment
    const positiveFeedbacks = await Feedback.countDocuments({ sentiment: 'positive' });
    const neutralFeedbacks = await Feedback.countDocuments({ sentiment: 'neutral' });
    const negativeFeedbacks = await Feedback.countDocuments({ sentiment: 'negative' });
    
    // Get counts by category
    const categoryCounts = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    return {
      total: totalCount,
      resolved: resolvedCount,
      unresolved: unresolvedCount,
      resolution_rate: totalCount > 0 ? (resolvedCount / totalCount * 100).toFixed(2) : 0,
      sentiment: {
        positive: positiveFeedbacks,
        neutral: neutralFeedbacks,
        negative: negativeFeedbacks
      },
      categories: categoryCounts.reduce((acc: Record<string, number>, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  } catch (error) {
    logger.error(`Error generating feedback statistics: ${error}`);
    throw error;
  }
};

import Joi from 'joi';
import { FeedbackCategory } from '../../types/enums/FeedbackCategory';
import { FeedbackSentiment } from '../../types/enums/FeedbackSentiment';

/**
 * Validate feedback creation input
 */
export const validateFeedbackInput = (data: any) => {
  const schema = Joi.object({
    text: Joi.string().min(3).max(5000).required().messages({
      'string.min': 'Feedback text must be at least 3 characters',
      'string.max': 'Feedback text cannot exceed 5000 characters',
      'any.required': 'Feedback text is required'
    }),
    sentiment: Joi.string().valid(...Object.values(FeedbackSentiment)).default(FeedbackSentiment.NEUTRAL),
    category: Joi.string().valid(...Object.values(FeedbackCategory)).default(FeedbackCategory.GENERAL)
  });

  return schema.validate(data);
};

/**
 * Validate feedback update input
 */
export const validateFeedbackUpdateInput = (data: any) => {
  const schema = Joi.object({
    resolved: Joi.boolean(),
    response: Joi.string().max(5000).allow('').allow(null)
  });

  return schema.validate(data);
};

/**
 * Validate feedback update input by admin
 */
export const validateAdminFeedbackUpdateInput = (data: any) => {
  const schema = Joi.object({
    resolved: Joi.boolean(),
    response: Joi.string().max(5000).allow('').allow(null),
    sentiment: Joi.string().valid(...Object.values(FeedbackSentiment)),
    category: Joi.string().valid(...Object.values(FeedbackCategory))
  });

  return schema.validate(data);
};

import { Document } from 'mongoose';
import { FeedbackSentiment } from '../enums/FeedbackSentiment';
import { FeedbackCategory } from '../enums/FeedbackCategory';

/**
 * Interface for feedback data
 */
export interface IFeedback extends Document {
  user: string;
  text: string;
  sentiment: FeedbackSentiment;
  category: FeedbackCategory;
  resolved: boolean;
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

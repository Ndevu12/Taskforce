import mongoose from 'mongoose';
import { IFeedback } from '../types/interfaces/IFeedback';
import { FeedbackCategory } from '../types/enums/FeedbackCategory';
import { FeedbackSentiment } from '../types/enums/FeedbackSentiment';

const feedbackSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  text: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 5000
  },
  sentiment: { 
    type: String, 
    enum: Object.values(FeedbackSentiment),
    default: FeedbackSentiment.NEUTRAL
  },
  category: { 
    type: String, 
    enum: Object.values(FeedbackCategory),
    default: FeedbackCategory.GENERAL
  },
  resolved: { 
    type: Boolean, 
    default: false
  },
  response: { 
    type: String,
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for user data
feedbackSchema.virtual('userData', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model<IFeedback>('Feedback', feedbackSchema);

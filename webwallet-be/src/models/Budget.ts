import mongoose from 'mongoose';
import { IBudget } from '../types/interfaces/IBudget';
import { BudgetPeriod } from '../types/enums/BudgetPeriod';

const budgetSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true // Add index for better query performance
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true,
    index: true 
  },
  amount: { 
    type: Number, 
    required: true,
    validate: {
      validator: (value: number) => value > 0,
      message: 'Budget amount must be greater than 0'
    }
  },
  period: { 
    type: String, 
    enum: Object.values(BudgetPeriod), 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true,
    index: true 
  },
  endDate: { 
    type: Date, 
    required: true,
    index: true 
  },
  currentSpent: { 
    type: Number, 
    default: 0,
    min: 0
  },
  notificationThreshold: { 
    type: Number, 
    default: 80,
    min: 0,
    max: 100
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validate that start date is before end date
budgetSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    this.invalidate('startDate', 'Start date must be before end date');
  }
  next();
});

// Create virtual property for remaining amount
budgetSchema.virtual('remaining').get(function() {
  return Math.max(0, this.amount - this.currentSpent);
});

// Create virtual property for usage percentage
budgetSchema.virtual('usagePercentage').get(function() {
  return Math.min(100, (this.currentSpent / this.amount) * 100);
});

// Create virtual property to check if budget is exceeded
budgetSchema.virtual('isExceeded').get(function() {
  return this.currentSpent > this.amount;
});

// Create virtual property to check if budget is approaching its limit
budgetSchema.virtual('isApproachingLimit').get(function() {
  const percentage = (this.currentSpent / this.amount) * 100;
  return percentage >= this.notificationThreshold && percentage < 100;
});

// Add virtual for related transactions
budgetSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'budget',
  justOne: false
});

export default mongoose.model<IBudget>('Budget', budgetSchema);
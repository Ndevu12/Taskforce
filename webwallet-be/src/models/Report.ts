import mongoose from 'mongoose';
import { IReport } from '../types/interfaces/IReport';
import { ReportType } from '../types/enums/ReportType';

const reportSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  type: { 
    type: String, 
    enum: Object.values(ReportType), 
    required: true 
  },
  dateRange: {
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    }
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual field to summarize report data
reportSchema.virtual('summary').get(function() {
  if (!this.data || !this.data.transactions) {
    return {
      transactionCount: 0,
      totalIncome: 0,
      totalExpense: 0
    };
  }

  const transactions = this.data.transactions || [];
  const totalIncome = transactions
    .filter((t: any) => t.type === 'INCOME')
    .reduce((sum: number, t: any) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter((t: any) => t.type === 'EXPENSE')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  return {
    transactionCount: transactions.length,
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense
  };
});

// Ensure date range is valid
reportSchema.pre('validate', function(next) {
  if (this.dateRange && this.dateRange.startDate && this.dateRange.endDate && 
      this.dateRange.startDate > this.dateRange.endDate) {
    this.invalidate('dateRange.startDate', 'Start date must be before end date');
  }
  next();
});

export default mongoose.model<IReport>('Report', reportSchema);

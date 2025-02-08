import mongoose, { Document } from 'mongoose';
import { IAccount } from '../types/interfaces/IAccount';
import { AccountType } from '../types/enums/AccountType';
import { TransactionType } from '../types/enums/TransactionType';

const accountSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100 
  },
  type: { 
    type: String, 
    enum: Object.values(AccountType), 
    required: true 
  },
  balance: { 
    type: Number, 
    default: 0,
    validate: {
      validator: function(this: IAccount, value: number) {
        // Allow negative balance only for credit accounts
        return this.type === AccountType.CREDIT || value >= 0;
      },
      message: () => 'Balance cannot be negative for non-credit accounts'
    }
  },
  currency: { 
    type: String, 
    default: 'RWF',
    uppercase: true,
    trim: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  accountNumber: {
    type: String,
    trim: true,
    sparse: true // Allows null values but ensures uniqueness if provided
  },
  lastTransactionDate: {
    type: Date
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for related transactions
accountSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'account',
  justOne: false
});

// Pre-save hook for validation
accountSchema.pre('save', function(next) {
  // Only allow negative balances for credit accounts
  if (this.balance < 0 && this.type !== AccountType.CREDIT) {
    return next(new Error('Only credit accounts can have negative balances'));
  }
  next();
});

// Update lastTransactionDate when a transaction is created
accountSchema.methods.updateLastTransactionDate = function() {
  this.lastTransactionDate = new Date();
  return this.save();
};

// Method to check if account has sufficient balance for a transaction
accountSchema.methods.hasSufficientBalance = function(amount: number, type: TransactionType) {
  if (type !== TransactionType.EXPENSE && type !== TransactionType.DEBT) {
    return true;
  }
  
  // Credit accounts can have negative balances
  if (this.type === 'CREDIT') {
    return true;
  }
  
  return this.balance >= amount;
};

export default mongoose.model<IAccount>('Account', accountSchema);

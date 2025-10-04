import Account from '../models/Account';
import { AccountType } from '../types/enums/AccountType';

export const seedDefaultAccounts = async (userId: string) => {
  // First check if user already has accounts
  const existingAccounts = await Account.find({ user: userId });
  if (existingAccounts.length > 0) {
    console.log(`User ${userId} already has accounts, skipping seeding`);
    return;
  }

  const defaultAccounts = [
    { 
      name: 'Cash Wallet', 
      type: AccountType.CASH, 
      balance: 0, 
      currency: 'RWF', 
      user: userId 
    },
    { 
      name: 'Bank Account', 
      type: AccountType.BANK, 
      balance: 0, 
      currency: 'RWF', 
      user: userId 
    },
    { 
      name: 'Mobile Money', 
      type: AccountType.MOBILE_MONEY, 
      balance: 0, 
      currency: 'RWF', 
      user: userId 
    }
  ];

  await Account.insertMany(defaultAccounts);
  console.log(`Default accounts created for user ${userId}`);
};

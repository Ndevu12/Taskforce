export enum AccountType {
  BANK = 'BANK',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CASH = 'CASH',
  CREDIT = 'CREDIT',
  OTHER = 'OTHER',
}

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  accountNumber?: string;
}

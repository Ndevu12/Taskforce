
import { Document } from 'mongoose';
import { UserRole } from '../enums/UserRole';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
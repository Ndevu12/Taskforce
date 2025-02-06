import mongoose from 'mongoose';
import { IUser } from '../types/interfaces/IUser';
import { UserRole } from '../types/enums/UserRole';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: UserRole },
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
import { IUser } from '../interfaces/IUser';
import User from '../models/User';

export const createUser = async (userData: IUser) => {
  const user = new User(userData);
  return await user.save();
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};

export const updateUserById = async (id: string, updateData: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUserById = async (id: string) => {
  return await User.findByIdAndDelete(id);
};
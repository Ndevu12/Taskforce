import User from '../models/User';
import { hashedPassword } from '../helpers/password';
import { IUser } from '../types';

export const createUser = async (userData: IUser) => {

    const hashed = await hashedPassword(userData.password);
    if (hashed) {
    userData.password = hashed;
    }
    const user = new User(userData);
    return await user.save();
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};

export const findUserByName = async (name: string) => {
  return await User.findOne({ name });
};

export const updateUserById = async (id: string, updateData: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUserById = async (id: string) => {
  return await User.findByIdAndDelete(id);
};
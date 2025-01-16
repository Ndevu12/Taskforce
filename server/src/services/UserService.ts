import User from '../models/User';
import { hashedPassword } from '../helpers/password';
import { IUser } from '../types';
import ReportSchedule from '../models/ReportSchedule';
import { BudgetPeriod } from '../types/enums/BudgetPeriod';

export const createUser = async (userData: IUser) => {
    const hashed = await hashedPassword(userData.password);
    if (hashed) {
        userData.password = hashed;
    }
    const user = new User(userData);
    const savedUser = await user.save();

    // Create a report schedule with type EXCEEDED and no start or end dates
    const reportSchedule = new ReportSchedule({
        user: savedUser._id,
        type: BudgetPeriod.EXCEEDED,
        startDate: null,
        endDate: null
    });
    await reportSchedule.save();

    return savedUser;
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
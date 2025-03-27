import User from '../models/User';
import { comparePassword } from '../helpers/password';
import { generateToken, expireToken } from '../helpers/token';
import logger from '../utils/logger';

export const authenticateUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials.');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials.');
    }

    const token = await generateToken({ userId: user._id, email: user.email, name: user.name, role: user.role });
    if (!token) {
        return;
    }
    return { token };
};

export const logoutUser = async (token: string) => {
    await expireToken(token);
};

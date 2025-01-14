import User from '../models/User';
import { comparePassword } from '../helpers/password';
import { generateToken, expireToken } from '../helpers/token';

export const authenticateUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = await generateToken({ userId: user._id });
    return { token, user };
};

export const logoutUser = async (token: string) => {
    await expireToken(token);
};

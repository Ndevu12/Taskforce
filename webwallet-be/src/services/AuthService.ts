import User from '../models/User';
import { comparePassword } from '../helpers/password';
import { generateToken, expireToken } from '../helpers/token';
import logger from '../utils/logger';

export const authenticateUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        logger.info(`User with email ${email} not found.`);
        throw new Error('Invalid credentials.');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        logger.info(`Invalid password for user with email ${email}.`);
        throw new Error('Invalid credentials.');
    }

    const token = await generateToken({ userId: user._id, email: user.email, name: user.name, role: user.role });
    if (!token) {
        logger.error(`Error generating token for user with email ${email}.`);
        return;
    }
    return { token };
};

export const logoutUser = async (token: string) => {
    await expireToken(token);
};

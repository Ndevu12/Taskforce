import bcrypt from 'bcryptjs';
import logger from '../utils/logger';
import { getEnvVariable } from '../config/getVariable';

const SECRET = getEnvVariable("JWT_SECRET");
if (!SECRET) {
    throw new Error("No secret key provided");
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error: any) {
        logger.error("Error comparing passwords:", error.message);
        return false;
    }
}

export const hashedPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error: any) {
        logger.error("Error hashing password:", error.message);
        throw new Error("Error hashing password");
    }
}
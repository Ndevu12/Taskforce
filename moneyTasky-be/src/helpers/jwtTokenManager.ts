import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { getEnvVariable } from "../config/getVariable";
import logger from "../utils/logger";

const SECRET = getEnvVariable("JWT_SECRET");
const REFRESH_TOKEN = getEnvVariable("JWT_REFRESH_SECRET");

if (!SECRET) {
  logger.error("JWT_SECRET is required for authentication. Please set it in your .env file");
  throw new Error("JWT_SECRET is required");
}

if (!REFRESH_TOKEN) {
  logger.error("JWT_REFRESH_SECRET is required for authentication. Please set it in your .env file");
  throw new Error("JWT_REFRESH_SECRET is required");
}

export const generateToken = (payload: JwtPayload) => {
  try {
    const token = jwt.sign(payload, SECRET, { expiresIn: "1d" });
    logger.info("Token generated successfully");
    return token;
  } catch (error) {
    logger.error("Error, TOKEN NOT GENERATED.\n", error);
    return null;
  }
};

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, SECRET);
        logger.info("Token verified successfully");
        return decoded;
    } catch (error) {
        logger.error("Error, TOKEN NOT VERIFIED.\n", error);
        return null;
    }
};

export const refreshToken = (payload: JwtPayload) => {
    try {
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN, { expiresIn: "7d" });
        logger.info("Refresh token generated successfully");
        return refreshToken;
    } catch (error) {
        logger.error("Error, TOKEN NOT REFRESHED.\n", error);
        return null;
    }
};

export const expireToken = (token: string) => {
    try {
        // Since we're not using Redis, we can't actually expire tokens
        // In a production system, you might want to maintain a blacklist
        // For now, we'll just log that the token should be considered expired
        logger.info("Token marked for expiration.");
    } catch (error) {
        logger.error("Error, TOKEN NOT EXPIRED.\n", error);
    }
};
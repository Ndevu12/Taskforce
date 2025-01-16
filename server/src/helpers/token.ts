import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { setToken, getToken, deleteToken } from "../services/external/redis";
import { getEnvVariable } from "../config/getVariable";
import logger from "../utils/logger";

const SECRET = getEnvVariable("JWT_SECRET");
const REFRESH_TOKEN = getEnvVariable("JWT_REFRESH_SECRET");

if (!SECRET) {
  throw new Error("No JWT secret provided");
}

if (!REFRESH_TOKEN) {
  throw new Error("No JWT refresh secret provided");
}

export const generateToken = async (payload: JwtPayload) => {
  try {
  const token = await jwt.sign(payload, SECRET, { expiresIn: "1d" });
  await setToken(token, JSON.stringify(payload), 86400);
  return token;
  } catch (error) {
    logger.error("Error, TOKEN NOT GENERATED.\n", error);
    return null;
  }
};

export const verifyToken = async (token: any) => {
    try {
        const decoded = await jwt.verify(token, SECRET);
        const storedToken = await getToken(token);
        if (!storedToken) {
          logger.error("Token not found in Redis");
          return null;
        }
        return decoded;
    } catch (error) {
        logger.error("Error, TOKEN NOT VERIFIED.\n", error);
        return null;
    }
};

export const refreshToken = async (payload: JwtPayload) => {
    try {
        const refreshToken = await jwt.sign(payload, SECRET, { expiresIn: "7d" });
        await setToken(refreshToken, JSON.stringify(payload), 604800);
        return refreshToken;
    } catch (error) {
        logger.error("Error, TOKEN NOT REFRESHED.\n", error);
    }
};

export const expireToken = async (token: string) => {
    try {
        const result = await deleteToken(token);
        if (result === 0) {
            logger.error("Token not found in Redis");
        }
    } catch (error) {
        logger.error("Error, TOKEN NOT EXPIRED.\n", error);
    }
};
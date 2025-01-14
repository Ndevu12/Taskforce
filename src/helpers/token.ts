import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { setToken, getToken, deleteToken } from "../services/external/redis";
import { getEnvVariable } from "../config/getVariable";

const SECRET = getEnvVariable("JWT_SECRET");
const REFRESH_TOKEN = getEnvVariable("JWT_REFRESH_SECRET");

if (!SECRET) {
  throw new Error("No JWT secret provided");
}

if (!REFRESH_TOKEN) {
  throw new Error("No JWT refresh secret provided");
}

export const generateToken = async (payload: JwtPayload) => {
  const token = await jwt.sign(payload, SECRET, { expiresIn: "1h" });
  await setToken(token, JSON.stringify(payload), 3600);
  return token;
};

export const verifyToken = async (token: any) => {
    try {
        const decoded = await jwt.verify(token, SECRET);
        const storedToken = await getToken(token);
        if (!storedToken) {
          console.log("Token not found in Redis");
          return null;
        }
        return decoded;
    } catch (error) {
        console.log("Error, TOKEN NOT VERIFIED.\n", error);
        return null;
    }
};

export const refreshToken = async (payload: JwtPayload) => {
    try {
        const refreshToken = await jwt.sign(payload, SECRET, { expiresIn: "7d" });
        await setToken(refreshToken, JSON.stringify(payload), 604800);
        return refreshToken;
    } catch (error) {
        console.log("Error, TOKEN NOT REFRESHED.\n", error);
    }
};

export const expireToken = async (token: string) => {
    try {
        const result = await deleteToken(token);
        if (result === 0) {
            console.log("Token not found in Redis");
        }
    } catch (error) {
        console.log("Error, TOKEN NOT EXPIRED.\n", error);
    }
};
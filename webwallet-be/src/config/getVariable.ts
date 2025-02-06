
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

export const getEnvVariable = (key: string): string | null => {
  const value = process.env[key];
  if (!value) {
    logger.info(`Environment variable ${key} not found`);
    return null;
  }
  return value;
};
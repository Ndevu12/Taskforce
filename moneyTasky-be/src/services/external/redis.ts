import redisClient from "../../config/redis";
import logger from "../../utils/logger";

export const setToken = async (key: string, value: string, expiration: number) => {
  if (!redisClient) {
    logger.warn("Redis not available, token not stored");
    return;
  }
  try {
    await redisClient.set(key, value, { EX: expiration });
  } catch (error) {
    logger.error("Failed to set token in Redis:", error);
  }
};

export const getToken = async (key: string) => {
  if (!redisClient) {
    logger.warn("Redis not available, token not retrieved");
    return null;
  }
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error("Failed to get token from Redis:", error);
    return null;
  }
};

export const deleteToken = async (key: string) => {
  if (!redisClient) {
    logger.warn("Redis not available, token not deleted");
    return 0;
  }
  try {
    const deleted = await redisClient.del(key);
    if (deleted === 0) {
      return 0;
    } else {
      return 1;
    }
  } catch (error) {
    logger.error("Failed to delete token from Redis:", error);
    return 0;
  }
};

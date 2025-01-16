import { createClient } from "redis";
import { getEnvVariable } from "./getVariable";
import logger from "../utils/logger";

const redisUrl = getEnvVariable("REDIS_URL");
if (!redisUrl) {
    throw new Error("No Redis URL provided");
}

const redisClient = createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries, cause) => {
            if (retries >= 5) {
                logger.info("Redis client reconnect failed after 5 attempts");
                return false;
            }
            return 2000;
        }
    }
});

redisClient.on("error", (err) => {
  logger.error("Redis client error: " + err.message);
});

redisClient.on("reconnecting", () => {
  logger.info("Redis client reconnecting");
});

redisClient.on("ready", () => {
  logger.info("Redis client ready");
});

redisClient.on("end", () => {
  logger.info("Redis client disconnected");
});

redisClient.connect();

export default redisClient;
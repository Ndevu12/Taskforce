import { getEnvVariable } from "./getVariable";
import logger from "../utils/logger";

const redisUrl = getEnvVariable("REDIS_URL");
let redisClient: any = null;

if (redisUrl) {
    try {
        // Dynamic import to avoid loading Redis if not needed
        const { createClient } = require("redis");
        
        redisClient = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries: number, cause: any) => {
                    if (retries >= 5) {
                        logger.info("Redis client reconnect failed after 5 attempts");
                        return false;
                    }
                    return 2000;
                }
            }
        });

        redisClient.on("error", (err: any) => {
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

        redisClient.connect().catch((err: any) => {
            logger.warn("Redis connection failed, continuing without Redis:", err.message);
            redisClient = null;
        });
    } catch (error) {
        logger.warn("Redis not available, continuing without Redis:", error);
        redisClient = null;
    }
} else {
    logger.info("Redis URL not provided, running without Redis");
}

export default redisClient;
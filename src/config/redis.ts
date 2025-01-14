
import redis from "redis";
import { getEnvVariable } from "./getVariable";

const redisUrl = getEnvVariable("REDIS_URL");
if (!redisUrl) {
    throw new Error("No Redis URL provided");
}

const redisClient = redis.createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
});

redisClient.connect();

export default redisClient;
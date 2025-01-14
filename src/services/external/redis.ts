import redisClient from "../../config/redis";

export const setToken = async (key: string, value: string, expiration: number) => {
  await redisClient.set(key, value, { EX: expiration });
};

export const getToken = async (key: string) => {
  return await redisClient.get(key);
};

export const deleteToken = async (key: string) => {
 const deleted = await redisClient.del(key);
 if (deleted === 0) {
   return 0;
 } else {
   return 1;
 }
};

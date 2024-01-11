import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "";

export const redisClient = createClient({
  url: redisUrl,
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    redisClient.on("error", err => {
      console.log("*************", err);
    });

    console.log("Redis client connected successfully");
    // redisClient.set("try", "Hello Welcome to Express with TypeORM");
  } catch (error) {
    // console.log(error);
    throw error;
    // setTimeout(connectRedis, 5000);
  }
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
};

export default redisClient;

import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const { REDIS_URL } = process.env || { REDIS_URL: "" };

export const redisClient = createClient({ url: REDIS_URL });

export const connectRedis = (): Promise<typeof createClient> =>
  new Promise(async (resolve, reject) => {
    await redisClient.connect();

    redisClient.on("error", err => {
      console.log("Error connecting to redis");
      reject(err);
    });

    redisClient.on("disconnected", () => {
      console.log(`Redis disconnected`);
    });

    redisClient.once("connect", () => {
      console.log(`Connected to database successfully`);
      // resolve(mongoose);
    });
  });

import mongoose, { Connection } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;
console.log(MONGO_URI);

export const connection = () =>
  new Promise((resolve, reject) => {
    mongoose.connect(MONGO_URI);

    const db: Connection = mongoose.connection;

    db.on("error", (error) => {
      console.log(`Error connecting to database.`);
      reject(error);
    });

    db.once("open", () => {
      console.log(`Connected to database successfully`);
      resolve(mongoose);
    });
  });

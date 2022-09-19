import mongoose, { Connection } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = () =>
  new Promise((resolve, reject) => {
    mongoose.connect(MONGO_URI);

    const db: Connection = mongoose.connection;

    db.on("error", (error) => {
      console.log(`Error connecting to database.`);
      reject(error);
    });

    db.on("disconnected", () => {
      console.log(`Disconnected from database successfully`);
    });

    db.once("open", () => {
      console.log(`Connected to database successfully`);
      resolve(mongoose);
    });
  });

export const disconnectDB = () => mongoose.connection.close();

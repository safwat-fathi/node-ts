// import fs from "fs";
import mongoose, { Connection } from "mongoose";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenv.config();
dotenvExpand.expand(dotenv.config());

// const ca = fs.readFileSync(`<path to CA certificate>`);
// const cert = fs.readFileSync(`<path to public client certificate>`);
// const key = fs.readFileSync(`<path to private client key>`);

const { MONGO_URI_DEV, MONGO_URI_PROD, NODE_ENV } = process.env || {
  MONGO_URI_DEV: "",
  MONGO_URI_PROD: "",
  NODE_ENV: "development",
};

export const MONGO_URI =
  NODE_ENV === "development" ? MONGO_URI_DEV : MONGO_URI_PROD;

mongoose.set("debug", NODE_ENV === "development" ? true : false);
mongoose.set("strictQuery", false);
// mongoose.set("strictPopulate", false);

export const connectDB = (): Promise<typeof mongoose> =>
  new Promise((resolve, reject) => {
    mongoose.connect(MONGO_URI);

    const db: Connection = mongoose.connection;

    db.on("error", error => {
      console.log(`Error connecting to database.`);
      reject(error);
    });

    db.on("disconnected", () => {
      console.log(`Database disconnected`);
    });

    db.once("open", () => {
      console.log(`Connected to database successfully`);
      resolve(mongoose);
    });
  });

export const disconnectDB = (): Promise<void> => mongoose.connection.close();

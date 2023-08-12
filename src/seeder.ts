// import fs from 'fs'
import mongoose from "mongoose";
import dotenv from "dotenv";
// import models
import { ProductModel } from "@/models/products/products.model";

// import JSON
import Products from "../_data/products.json";

dotenv.config();

// const products = JSON.parse(fs.readFileSync(Products, 'utf-8'))
const { MONGO_URI_DEV, MONGO_URI_PROD, NODE_ENV } = process.env || {
  MONGO_URI_DEV: "",
  MONGO_URI_PROD: "",
  NODE_ENV: "development",
};

export const MONGO_URI =
  NODE_ENV === "development" ? MONGO_URI_DEV : MONGO_URI_PROD;

mongoose.connect(MONGO_URI);

const importData = async () => {
  try {
    await ProductModel.insertMany(Products);

    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Error seeding database@seeder", error);
  } finally {
    await mongoose.disconnect();
  }
};

const deleteData = async () => {
  try {
    await ProductModel.deleteMany();

    console.log("Data deleted successfully");
  } catch (error) {
    console.error("Error deleting database@seeder.ts", error);
  } finally {
    await mongoose.disconnect();
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

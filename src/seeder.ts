import mongoose from "mongoose";
import dotenv from "dotenv";

import { hashPassword } from "./lib/utils/auth";

import { connectDB } from "./config/db.config";

// import models
import { ProductModel } from "./models/products/products.model";
import { UserModel } from "./models/user/user.model";
import { CategoryModel } from "./models/categories/categories.model";

// import JSON
import Products from "../_data/products.json";
import Users from "../_data/users.json";
import Categories from "../_data/categories.json";

dotenv.config();

// const { MONGO_URI_DEV, MONGO_URI_PROD, NODE_ENV } = process.env || {
//   MONGO_URI_DEV: "",
//   MONGO_URI_PROD: "",
//   NODE_ENV: "development",
// };

// export const MONGO_URI =
//   NODE_ENV === "development" ? MONGO_URI_DEV : MONGO_URI_PROD;

// mongoose.connect(MONGO_URI as string);

connectDB();

const importData = async () => {
  try {
    await ProductModel.insertMany(Products);

    // add password to users
    const users = await Promise.all(
      Users.map(async user => ({
        ...user,
        password: await hashPassword("123456789"),
      }))
    );

    await UserModel.insertMany(users);
    await CategoryModel.insertMany(Categories);

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
    await UserModel.deleteMany();
    await CategoryModel.deleteMany();

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

import mongoose from "mongoose";
import dotenv from "dotenv";

import { hashPassword } from "./lib/utils/auth";

import { MongooseDB, connectDB } from "./config/db.config";

import { ProductService } from "./services/products.service";

// import models
// import { ProductModel } from "./models/products/products.model";
// import { UserModel } from "./models/user/user.model";
// import { CategoryModel } from "./models/categories/categories.model";

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

// connectDB();
const mongodDB = MongooseDB.getInstance();

const importData = async () => {
  try {
    await mongodDB.connect();
    await mongodDB.client.model("Product").insertMany(Products);

    // add password to users
    // const usersSeed = await Promise.all(
    //   Users.map(async user => ({
    //     ...user,
    //     password: await hashPassword("123456789"),
    //   }))
    // );

    // await mongodDB.client.model("User").insertMany(usersSeed);
    // await UserModel.insertMany(usersSeed);
    // await CategoryModel.insertMany(Categories);

    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Error seeding database@seeder", error);
  } finally {
    // await mongoose.disconnect();
    await mongodDB.disconnect();
  }
};

// const deleteData = async () => {
//   try {
//     await mongodDB.connect();

//     await ProductModel.deleteMany();
//     await UserModel.deleteMany();
//     await CategoryModel.deleteMany();

//     console.log("Data deleted successfully");
//   } catch (error) {
//     console.error("Error deleting database@seeder.ts", error);
//   } finally {
//     // await mongoose.disconnect();
//     await mongodDB.disconnect();
//   }
// };

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  // deleteData();
}

// class DataBaseSeeder {
// 	private _dbConnection: DBConnection<typeof mongoose>;

// 	constructor(dbConnection: DBConnection<typeof mongoose>) {
// 			this._dbConnection = dbConnection;

// 	}

// }

// const dbSeeder = new DataBaseSeeder({
//   connect: async () => await connectDB(),
// });

import dotenv from "dotenv";

import { DataSource } from "typeorm";

dotenv.config();

const { DB_TYPE, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, NODE_ENV } = process.env;

export const AppDataSource = new DataSource({
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: NODE_ENV === "development" ? true : false, // synchronize is not recommended in production
  // entities: [User, Product, Category],
  entities: ["@/entities/*.entity.ts"],
});

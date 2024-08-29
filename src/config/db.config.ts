import dotenv from "dotenv";
import { Product } from "@/entities/product/product.entity";
import { DataSource } from "typeorm";

dotenv.config();

const { NODE_ENV } = process.env;

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	// username: "your-username",
	// password: "your-password",
	database: "nla",
	synchronize: NODE_ENV === "development" ? true : false, // synchronize is not recommended in production
	entities: [Product],
});

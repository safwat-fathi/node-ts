import dotenv from "dotenv";
import { seedCategories } from "./categories.seeder";
import { seedProducts } from "./products.seeder";
import { seedUsers } from "./users.seeder";

dotenv.config();

const { NODE_ENV } = process.env || {
  NODE_ENV: "development",
};

export const runSeeders = () => {
  if (NODE_ENV === "development") {
    seedCategories();
    seedProducts();
    seedUsers();
  }
};

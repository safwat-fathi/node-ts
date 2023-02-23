import { Router } from "express";
import {
  findByName,
  findByCategory,
  addProduct,
  index,
} from "controllers/products.controller";
import { verifyToken } from "middlewares/auth.middleware";
import { paginate } from "middlewares/paginate.middleware";
import { filter } from "middlewares/filter.middleware";
import { Product } from "types/db";
import { ProductsStore } from "models/products/products.model";

const products = Router();

const productStore = new ProductsStore();

// * INDEX
products.get(
  "/",
  filter<Product>(productStore.filter),
  paginate<Product>(productStore.index),
  index
);

// * CREATE
products.post("/add", addProduct);

export default products;

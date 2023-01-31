import { Router } from "express";
import {
  findByCategory,
  addProduct,
  index,
} from "controllers/products.controller";
import { verifyToken } from "middlewares/auth.middleware";
import { paginate } from "middlewares/paginate.middleware";
import { Product } from "types/db";
import { ProductsStore } from "models/products/products.model";

const products = Router();

const productStore = new ProductsStore();

// * INDEX
products.get("/", paginate<Product>(productStore.index), index);

// * SEARCH
products.get("/:categoryId", findByCategory);

// * CREATE
products.post("/add", verifyToken, addProduct);

export default products;

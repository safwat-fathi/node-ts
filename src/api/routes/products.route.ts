import { Router } from "express";
import {
  findByName,
  findByCategory,
  addProduct,
  index,
} from "api/controllers/products.controller";
import { verifyToken } from "api/middlewares/auth.middleware";
import { paginate } from "api/middlewares/paginate.middleware";
import { Product } from "types/db";
import { ProductsStore } from "api/models/products/products.model";

const products = Router();

const productStore = new ProductsStore();

// * INDEX
products.get("/", paginate<Product>(productStore.index), index);

// * CREATE
products.post("/add", addProduct);

export default products;

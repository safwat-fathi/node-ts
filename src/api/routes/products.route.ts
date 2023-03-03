import { Router } from "express";
import {
  // findByName,
  // findByCategory,
  addProduct,
  index,
} from "api/controllers/products.controller";
import { verifyToken } from "api/middlewares/auth.middleware";
import { paginate } from "api/middlewares/paginate.middleware";
import { Product } from "types/db";
import { ProductService } from "services/products.service";

const products = Router();

const productService = new ProductService();

// * INDEX
products.get("/", paginate<Product>(productService.index), index);

// * CREATE
products.post("/add", verifyToken, addProduct);

export default products;

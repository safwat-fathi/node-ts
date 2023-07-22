import { Router } from "express";
import {
  create,
  index,
  indexPaginated,
} from "@/api/controllers/products.controller";
// import { verifyToken } from "@/api/middlewares/auth.middleware";
import { paginate } from "@/api/middlewares/paginate.middleware";
import { Product } from "@/types/db";
import { ProductService } from "@/services/products.service";

const products = Router();

const productService = new ProductService();

// * INDEX
products.get("/index", index(productService.index));

// * Index with pagination
products.get("/", paginate<Product>(productService.index), indexPaginated);

// * CREATE
products.post("/create", create);

export default products;

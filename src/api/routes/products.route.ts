import { Router } from "express";
import { create, index } from "src/api/controllers/products.controller";
// import { verifyToken } from "src/api/middlewares/auth.middleware";
import { paginate } from "src/api/middlewares/paginate.middleware";
import { Product } from "src/types/db";
import { ProductService } from "src/services/products.service";

const products = Router();

const productService = new ProductService();

// * INDEX
products.get("/", paginate<Product>(productService.index), index);

// * CREATE
products.post("/create", create);

export default products;

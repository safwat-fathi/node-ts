import { Router } from "express";
import {
  create,
  // index,
  getProduct,
  index,
  indexPaginated,
} from "@/api/controllers/products.controller";
import { verifyToken } from "@/api/middlewares/auth.middleware";
import { paginate } from "@/api/middlewares/paginate.middleware";
import { Product } from "@/types/db";
import { ProductService } from "@/services/products.service";

const products = Router();

const productService = new ProductService();

// * INDEX
// products.get("/index", index(productService.index));
// products.get(
//   "/index",
//   products.get("/", (req: Request, res: Response, next: NextFunction) => {
//     const { page } = req.query;
//     console.log("🚀 ~ products.get ~ page:", page);

//     if (page) {
//       console.log("page found");

//       return next();
//     }
//     console.log("no page found");

//     return index(productService.index);
//   }),
//   paginate<Product>(productService.index),
//   indexPaginated
// );

// * Get all
products.get("/", index);

// * Index
products.get(
  "/index",
  paginate<Product>(productService.indexPaginated),
  indexPaginated
);

// * Get product with slug
products.get("/:slug", getProduct);

// * Create
products.post("/create", verifyToken, create);

export default products;

import { Router } from "express";
import ProductController from "../controllers/product.controller";

const productController = new ProductController();

const products = Router();

products.post("/products", productController.create);
products.get("/products", productController.list);
products.get("/products/:id", productController.read);
products.put("/products/:id", productController.update);
products.delete("/products/:id", productController.delete);
products.get("/products/:categoryId", productController.getProductByCategory);
products.get("/products/search", productController.search);

export default products;

import { Router } from "express";
import productController from "../controllers/product.controller";

const products = Router();

products.post("/products", productController.create);
products.get("/products", productController.list);
products.get("/products/:id", productController.read);
products.put("/products/:id", productController.update);
products.delete("/products/:id", productController.delete);

export default products;

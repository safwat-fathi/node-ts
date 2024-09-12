import { Router } from "express";
import ProductController from "../controllers/product.controller";

const productController = new ProductController();

const products = Router();

const productByIdRoute = "/:id";

products.get("/", productController.list);
products.post("/", productController.create);
products.get(productByIdRoute, productController.read);
products.put(productByIdRoute, productController.update);
products.delete(productByIdRoute, productController.delete);
products.get("/products/:categoryId", productController.getProductByCategory);
products.get("/products/search", productController.search);

export default products;

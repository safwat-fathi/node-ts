import { Router } from "express";
import ProductController from "../controllers/product.controller";

const productController = new ProductController();

const products = Router();

const productsRoute = "/products";
const productByIdRoute = "/products/:id";

products.post(productsRoute, productController.create);
products.get(productsRoute, productController.list);
products.get(productByIdRoute, productController.read);
products.put(productByIdRoute, productController.update);
products.delete(productByIdRoute, productController.delete);
products.get("/products/:categoryId", productController.getProductByCategory);
products.get("/products/search", productController.search);

export default products;

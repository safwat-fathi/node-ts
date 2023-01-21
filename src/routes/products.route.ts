import { Router } from "express";
import { findByCategory, addProduct } from "controllers/products.controller";
import { verifyToken } from "middlewares/auth.middleware";

const products = Router();

// * SEARCH
products.get("/:categoryId", findByCategory);

// * CREATE
products.post("/add", verifyToken, addProduct);

export default products;

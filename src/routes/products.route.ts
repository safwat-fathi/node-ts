import { Router } from "express";
import { findByCategory, addProduct } from "controllers/products.controller";

const products = Router();

// * SEARCH
products.get("/:categoryId", findByCategory);

// * CREATE
products.post("/add", addProduct);

export default products;

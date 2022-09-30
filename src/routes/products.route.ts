import { Router } from "express";
import { findByCategory, addProduct } from "controllers/products.controller";

const router = Router();

// * SEARCH
router.get("/products/:categoryId", findByCategory);

// * CREATE
router.post("/products/add", addProduct);

export default router;

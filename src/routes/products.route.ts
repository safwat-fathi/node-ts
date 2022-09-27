import { Router } from "express";
import { findByCategory } from "controllers/products.controller";

const router = Router();

router.get("/products/:categoryId", findByCategory);

export default router;

import { Router } from "express";
import { findByCategory, findCategory } from "controllers/products.controller";

const router = Router();

router.get("/products/:categoryId", findByCategory);
router.get("/category/:categoryId", findCategory);

export default router;

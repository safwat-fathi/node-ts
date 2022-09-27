import { Router } from "express";
import { findCategoryByName } from "controllers/categories.controller";

const router = Router();

router.get("/category/:categoryName", findCategoryByName);

export default router;

import { Router } from "express";
import { findCategoryByName } from "controllers/categories.controller";

const router = Router();

// search
router.get("/category/:categoryName", findCategoryByName);

// create

export default router;

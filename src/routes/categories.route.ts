import { Router } from "express";
import { findCategoryByName } from "controllers/categories.controller";

const category = Router();

// search
category.get("/:categoryName", findCategoryByName);

// create

export default category;

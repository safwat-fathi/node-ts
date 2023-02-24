import { Router } from "express";
import { findCategoryByName } from "api/controllers/categories.controller";

const category = Router();

// search
category.get("/:categoryName", findCategoryByName);

// create

export default category;

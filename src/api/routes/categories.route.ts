import { Router } from "express";
import { index } from "api/controllers/categories.controller";
import { paginate } from "api/middlewares/paginate.middleware";
import { CategoryService } from "services/categories.service";
import { Category } from "types/db";

const category = Router();

const categoryService = new CategoryService();

// * INDEX
category.get("/", paginate<Category>(categoryService.index), index);

export default category;

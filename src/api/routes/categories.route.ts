import { Router } from "express";
import {
  index,
  create,
  update,
} from "src/api/controllers/categories.controller";
import { paginate } from "src/api/middlewares/paginate.middleware";
import { CategoryService } from "src/services/categories.service";
import { Category } from "src/types/db";

const category = Router();

const categoryService = new CategoryService();

// * INDEX
category.get("/", paginate<Category>(categoryService.index), index);
// * CREATE
category.post("/create", create);
// * UPDATE
category.post("/update", update);

export default category;

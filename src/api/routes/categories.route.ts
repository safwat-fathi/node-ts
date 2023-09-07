import { Router } from "express";
import {
  index,
  create,
  update,
  remove,
  indexPaginated,
} from "@/api/controllers/categories.controller";
import { paginate } from "@/api/middlewares/paginate.middleware";
import { CategoryService } from "@/services/categories.service";
import { Category } from "@/types/db";

const category = Router();

const categoryService = new CategoryService();

// * INDEX ALL
category.get("/index", index);

// * INDEX PAGINATED
category.get(
  "/",
  paginate<Category>(categoryService.indexPaginated),
  indexPaginated
);

// * CREATE
category.post("/create", create);

// * UPDATE
category.post("/update", update);

// * DELETE
category.delete("/delete", remove);

export default category;

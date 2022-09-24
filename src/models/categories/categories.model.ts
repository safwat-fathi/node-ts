import { model } from "mongoose";
import { Category } from "types/db";
import { categorySchema } from "./categories.schema";

export const CategoryModel = model<Category>("Category", categorySchema);

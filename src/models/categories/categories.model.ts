import { model } from "mongoose";
import { CategoryDoc } from "types/db";
import { categorySchema } from "./categories.schema";

export const CategoryModel = model<CategoryDoc>("Category", categorySchema);

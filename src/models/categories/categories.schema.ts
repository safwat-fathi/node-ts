import { Schema } from "mongoose";
import { Category } from "types/db";

export const categorySchema = new Schema<Category>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sub: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
  parent: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

import { Schema } from "mongoose";
import { Category } from "types/db";
import { CategoryModel } from "./categories.model";

export const categorySchema = new Schema<Category>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    sub: {
      type: [{ type: Schema.Types.ObjectId, ref: "Category" }],
      default: null,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
      default: null,
    },
  },
  { timestamps: true }
);

categorySchema.pre("save", async function (next) {
  if (this.parent !== null) {
    const parentDoc = await CategoryModel.findById(this.parent);

    await parentDoc?.updateOne({ $push: { sub: this.id } });
  }

  next();
});

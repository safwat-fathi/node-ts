import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { CategoryDoc } from "types/db";
import { CategoryModel } from "./categories.model";

export const categorySchema = new Schema<CategoryDoc>(
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

// update parent sub when sub category created
categorySchema.pre<CategoryDoc>(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (this.parent !== null) {
      const parentDoc = await CategoryModel.findById(this.parent);

      await parentDoc?.updateOne({ $push: { sub: this.id } });
    }

    next();
  }
);

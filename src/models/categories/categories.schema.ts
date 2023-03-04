import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { CategoryDoc } from "types/db";
import { CategoryModel } from "./categories.model";

export const categorySchema = new Schema<CategoryDoc>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    sub: {
      type: [{ type: Schema.Types.ObjectId, ref: "Category" }],
      default: [],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

// Cascade delete categories when a parent category is deleted
categorySchema.pre<CategoryDoc>(
  "remove",
  async function (next: CallbackWithoutResultAndOptionalError) {
    await CategoryModel.deleteMany({ parent: this._id });

    next();
  }
);

// Update parent sub when sub category created
categorySchema.pre<CategoryDoc>(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (this.parent !== null) {
      const parentDoc = await CategoryModel.findById(this.parent);

      if (!parentDoc) {
        return next(new Error("parent document not found"));
      }

      await parentDoc.updateOne({ $push: { sub: this.id } });
    }

    next();
  }
);

// Reverse populate with virtuals
// categorySchema.virtual("sub", {
//   ref: "Category",
//   localField: "_id",
//   foreignField: "parent",
//   justOne: false,
// });

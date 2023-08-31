import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { Category, CategoryDoc } from "@/types/db";
import { CategoryModel } from "./categories.model";

export const CategorySchema = new Schema<Category>(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    sub: {
      type: [String],
      default: null,
    },
    // sub: {
    //   type: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    //   default: [],
    // },
    parent: {
      type: [String],
      default: null,
    },
    // parent: {
    // type: Schema.Types.ObjectId,
    // ref: "Category",
    // },
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    // },
    // toObject: { virtuals: true },
  }
);

// Cascade delete categories when a parent category is deleted
CategorySchema.pre<CategoryDoc>(
  "remove",
  async function (next: CallbackWithoutResultAndOptionalError) {
    await CategoryModel.deleteMany({ parent: this._id });

    next();
  }
);

// Update a parent sub categories when new sub category created
CategorySchema.pre<CategoryDoc>(
  "validate",
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (this.parent) {
      // await Promise.all(
      // this.parent.map(async item => {
      //   const parentDoc = await CategoryModel.findOne({ name: item });

      //   if (parentDoc) {
      //     await parentDoc.updateOne({ $push: { sub: this.name } });
      //   }
      // })
      const parentDoc = await CategoryModel.findOne({ name: this.parent });

      if (parentDoc) {
        await parentDoc.updateOne({ $push: { sub: this.name } });
      }
      // );
      // return next(new Error("parent document not found"));
    }

    next();
  }
);

// Reverse populate with virtuals
// CategorySchema.virtual("sub", {
//   ref: "Category",
//   localField: "_id",
//   foreignField: "parent",
//   justOne: false,
// });

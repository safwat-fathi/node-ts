import { Schema } from "mongoose";
import { ReviewDoc } from "src/types/db";

export const ReviewSchema = new Schema<ReviewDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "{VALUE} can not be null"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "{VALUE} can not be null"],
      maxlength: 100,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "{VALUE} can not be null"],
      maxlength: 500,
    },
    rating: {
      type: Number,
      min: [1, "{VALUE} can not be smaller than 1"],
      max: [5, "{VALUE} can not be larger than 5"],
      required: [true, "{VALUE} can not be null"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "{VALUE} can not be null"],
    },
  },
  {
    timestamps: true,
  }
);

// prevent user from submitting more than one review for product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// TODO: not completed
ReviewSchema.static(
  "averageRating",
  async function averageRating(productId: Schema.Types.ObjectId) {
    const obj = await this.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
  }
);

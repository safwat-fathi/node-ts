import { Schema } from "mongoose";
import { Product } from "types/db";

export const productSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    images: [
      {
        type: {
          type: String,
          enum: {
            values: ["card", "cover", "thumbnail"],
            message: "{VALUE} is not supported",
          },
          default: "thumbnail",
          required: true,
        },
        url: { type: String, required: true },
      },
    ],
    categories: [
      { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ],
    size: Number,
    color: String,
  },
  {
    timestamps: true,
  }
);

import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { Product } from "types/db";
import slugify from "slugify";

export const ProductsSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Please set a price more than 0"],
    },
    stock: {
      type: Number,
      required: [true, "Please add a stock"],
      min: [0, "Please set a stock more than 0"],
    },
    images: {
      type: [
        {
          imgType: {
            type: String,
            enum: {
              values: ["card", "cover", "thumbnail"],
              message: "{VALUE} is not supported",
            },
            default: "thumbnail",
            required: [true, "Please add image type"],
          },
          url: { type: String, required: true },
          _id: false,
        },
      ],
      required: [true, "Please add images"],
      validate: (
        val: { imgType: "card" | "cover" | "thumbnail"; url: string }[]
      ) => Array.isArray(val) && val.length > 0,
    },
    categories: {
      type: [Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "Please add images"],
      validate: (val: Schema.Types.ObjectId[]) =>
        Array.isArray(val) && val.length > 0,
    },
    size: Number,
    color: String,
  },
  {
    timestamps: true,
  }
);

ProductsSchema.pre<Product>(
  "save",
  function (next: CallbackWithoutResultAndOptionalError) {
    this.slug = slugify(this.name, { lower: true });

    next();
  }
);

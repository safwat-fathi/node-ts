import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { ProductDoc } from "types/db";
import { slugify } from "utils/string";

export const ProductsSchema = new Schema<ProductDoc>(
  {
    name: {
      type: String,
      required: [true, "{VALUE} can not be null"],
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "{VALUE} can not be null"],
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "{VALUE} can not be null"],
      min: [0, "Please set a price more than 0"],
    },
    stock: {
      type: Number,
      required: [true, "{VALUE} can not be null"],
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
            required: [true, "{VALUE} can not be null, please add image type"],
          },
          url: { type: String, required: [true, "{VALUE} can not be null"] },
          _id: false,
        },
      ],
      required: [true, "{VALUE} can not be null"],
      validate: (
        val: { imgType: "card" | "cover" | "thumbnail"; url: string }[]
      ) => Array.isArray(val) && val.length > 0,
    },
    categories: {
      type: [Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "{VALUE} can not be null"],
      validate: (val: Schema.Types.ObjectId[]) =>
        Array.isArray(val) && val.length > 0,
    },
  },
  {
    timestamps: true,
  }
);

// slugify every prod before save
ProductsSchema.pre<ProductDoc>(
  "save",
  function (next: CallbackWithoutResultAndOptionalError) {
    this.slug = slugify(this.name);

    next();
  }
);

import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { Product, ProductDoc, ProductImage } from "@/types/db";
import { slugify } from "@/lib/utils/string";

// TODO: fuzzy search by name (https://stackoverflow.com/questions/44833817/mongodb-full-and-partial-text-search)
export const ProductsSchema = new Schema<Product>(
  {
    name: {
      type: String,
      // unique: false,
      index: "text",
      required: [true, "{VALUE} can not be null"],
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "{VALUE} can not be null"],
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    brand: {
      type: String,
      index: true,
      required: [true, "{VALUE} can not be null"],
      maxlength: [50, "Description can not be more than 50 characters"],
    },
    slug: {
      type: String,
      required: [true, "{VALUE} can not be null"],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "{VALUE} can not be null"],
      min: [0, "Please set a price more than 0"],
      index: -1,
    },
    stock: {
      type: Number,
      required: [true, "{VALUE} can not be null"],
      min: [0, "Please set a stock more than 0"],
    },
    rating: {
      type: Number,
      required: [true, "{VALUE} can not be null"],
      min: [0, "Please set a rating more than 0"],
    },
    discountPercentage: {
      type: Number,
      // required: [true, "{VALUE} can not be null"],
      min: [0, "Please set a discount percentage more than 0"],
      max: [100, "Please set a discount percentage less than or equal 100"],
    },
    thumbnail: {
      _id: false,
      type: String,
      required: [true, "{VALUE} can not be null"],
    },
    categories: {
      type: [String],
      required: [true, "{VALUE} can not be null"],
      index: true,
      // validate: (val: Schema.Types.ObjectId[]) =>
      //   Array.isArray(val) && val.length > 0,
    },
    images: {
      type: [String],
      _id: false,
      required: [true, "{VALUE} can not be null"],
      validate: (val: string[]) => Array.isArray(val) && val.length > 0,
      // select: false,
    },
    // images: {
    //   type: [
    //     {
    //       imgType: {
    //         type: String,
    //         enum: {
    //           values: ["card", "cover", "thumbnail"],
    //           message: "{VALUE} is not supported",
    //         },
    //         default: ProductImage.Thumbnail,
    //         // required: [true, "{VALUE} can not be null, please add image type"],
    //       },
    //       url: { type: String, required: [true, "{VALUE} can not be null"] },
    //       _id: false,
    //     },
    //   ],
    //   required: [true, "{VALUE} can not be null"],
    //   validate: (
    //     val: { imgType: "card" | "cover" | "thumbnail"; url: string }[]
    //   ) => Array.isArray(val) && val.length > 0,
    // },
    // categories: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "Category",
    //   required: [true, "{VALUE} can not be null"],
    //   // validate: (val: Schema.Types.ObjectId[]) =>
    //   //   Array.isArray(val) && val.length > 0,
    // },
  },
  {
    // versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc: ProductDoc, ret: Partial<ProductDoc>, opt) {
        delete ret["images"];
        // delete ret["_id"];
        delete ret["__v"];
        return ret;
      },
    },
  }
);

// ProductsSchema.index({ name: "text", brand: "text", categories: "text" });
// console.log("🚀 ~ ProductsSchema.indexes():", ProductsSchema.indexes());

// ProductsSchema.pre(
//   "find",
//   function (next: CallbackWithoutResultAndOptionalError) {
//     console.log("****************");
//     console.log(this.getFilter());

//     console.log("****************");

//     next();
//   }
// );

// slugify every product before save
ProductsSchema.pre<ProductDoc>(
  "validate",
  function (next: CallbackWithoutResultAndOptionalError) {
    this.slug = slugify(this.name);

    next();
  }
);

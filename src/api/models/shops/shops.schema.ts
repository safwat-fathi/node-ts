import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { Shop } from "types/db";
import { slugify } from "lib/utils/string";

export const ShopsSchema = new Schema<Shop>(
  {
    name: {
      type: String,
      required: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    logo: {
      type: [
        {
          logoType: {
            type: String,
            enum: {
              values: ["cover", "thumbnail"],
              message: "{VALUE} is not supported",
            },
            default: "thumbnail",
            required: [true, "Please add image type"],
          },
          url: { type: String, required: true },
          _id: false,
        },
      ],
      required: [true, "Please add logo"],
      validate: [
        (val: { imgType: "cover" | "thumbnail"; url: string }[]) =>
          Array.isArray(val) && val.length > 0,
        "{PATH} Must have 3 entries",
      ],
    },
    // TODO: add city to the location
    location: {
      type: [String, String],
      validate: [
        (val: [string, string]) => Array.isArray(val) && val.length === 2,
        "{PATH} Must have 2 entries",
      ],
    },
  },
  {
    timestamps: true,
  }
);

ShopsSchema.pre<Shop>(
  "save",
  function (next: CallbackWithoutResultAndOptionalError) {
    this.slug = slugify(this.name);

    next();
  }
);

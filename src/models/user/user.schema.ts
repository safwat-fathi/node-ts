import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { User } from "src/types/db";
import { hashPassword } from "src/lib/utils/auth";

export const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, "name required"],
      match: [/^[a-zA-Z ]*$/, "name is not valid"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "must use valid email address",
      ],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "phone required"],
      match: [
        /\d{3}\s?\d{4}-?\d{4}/gm,
        "phone must be egyptian valid mobile number",
      ],
    },
    password: { type: String, required: [true, "password required"] },
    address: {
      type: [String],
      default: [],
    },
    orders: {
      type: [Schema.Types.ObjectId],
      ref: "Order",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<User>(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    // hash password
    const hashedPassword = await hashPassword(this.password);

    this.password = hashedPassword;

    next();
  }
);

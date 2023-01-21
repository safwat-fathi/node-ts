import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { User } from "types/db";
import { hashPassword } from "utils/auth";

export const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true, match: /^[a-zA-Z ]*$/ },
    email: {
      type: String,
      required: true,
      match:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    phone: {
      type: String,
      required: true,
      match: /\d{3}\s?\d{4}-?\d{4}/gm,
    },
    password: { type: String, required: true },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    orders: {
      type: [Schema.Types.ObjectId],
      ref: "Order",
      required: true,
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

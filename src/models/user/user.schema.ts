import {
  CallbackWithoutResultAndOptionalError,
  Document,
  Schema,
} from "mongoose";
import { User, UserDoc } from "@/types/db";
import { hashPassword } from "@lib/utils/auth";

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
    password: {
      type: String,
      required: [true, "password required"],
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
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
    toJSON: {
      virtuals: true,
      transform: function (doc: UserDoc, ret: Partial<UserDoc>, opt) {
        delete ret["password"];
        delete ret["_id"];
        delete ret["__v"];
        return ret;
      },
    },
  }
);

UserSchema.pre<UserDoc>(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    // run password hash only if password modified
    if (this.isModified("password")) {
      // hash password
      const hashedPassword = await hashPassword(this.password);

      this.password = hashedPassword;
    }

    next();
  }
);

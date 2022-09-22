import mongoose, { Schema } from "mongoose";
import { User } from "types/db";

export const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    match: /\d{3}\s?\d{4}-?\d{4}/gm,
  },
  password: { type: String, required: true },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

userSchema.pre("save", (next) => {
  console.log("saved!");

  next();
});

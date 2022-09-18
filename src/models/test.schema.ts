import { Schema } from "mongoose";
import { Test } from "types/db.types";

export const testSchema = new Schema<Test>({
  propOne: { type: String, minlength: 10, required: true },
  propTwo: { type: Number, min: 5, required: true },
  propThree: { type: String, enum: ["Value_1", "Value_2"], required: false },
});

testSchema.pre("save", (next) => {
  console.log("saved!");

  next();
});

import { Schema, model, Document } from "mongoose";
import { User } from "interfaces/User";

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  avatar: String,
});

const userModel = model<User & Document>("User", userSchema);

export default userModel;

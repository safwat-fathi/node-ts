import { model } from "mongoose";
import { User } from "types/db";
import { userSchema } from "./user.schema";

export const UserModel = model<User>("User", userSchema);

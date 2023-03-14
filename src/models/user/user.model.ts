import { model } from "mongoose";
import { UserDoc } from "@/types/db";
import { UserSchema } from "./user.schema";

export const UserModel = model<UserDoc>("User", UserSchema);

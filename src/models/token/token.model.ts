import { model } from "mongoose";
import { TokenDoc } from "@/types/db";
import { TokenSchema } from "./token.schema";

export const UserModel = model<TokenDoc>("Token", TokenSchema);

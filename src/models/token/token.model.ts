import { model } from "mongoose";
import { TokenDoc } from "@/types/db";
import { TokenSchema } from "./token.schema";

export const TokenModel = model<TokenDoc>("Token", TokenSchema);

import {
  CallbackWithoutResultAndOptionalError,
  Document,
  Schema,
} from "mongoose";
import { Token, TokenDoc } from "@/types/db";
import { hashPassword } from "@lib/utils/auth";

export const TokenSchema = new Schema<Token>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "{VALUE} can not be null"],
    },
    token: {
      type: String,
      required: [true, "{VALUE} can not be null"],
    },
  },
  {
    timestamps: true,
  }
);

// TokenSchema.pre<TokenDoc>(
//   "save",
//   async function (next: CallbackWithoutResultAndOptionalError) {

//     next();
//   }
// );

import { Schema } from "mongoose";
import { Token } from "@/types/db";

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

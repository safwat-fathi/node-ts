import { Schema } from "mongoose";
import { Role } from "types/db/index";

export const roleSchema = new Schema<Role>({
  name: {
    type: String,
    enum: {
      values: ["admin", "moderator", "user"],
      message: "{VALUE} is not supported",
    },
  },
});

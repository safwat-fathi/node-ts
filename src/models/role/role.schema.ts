import { Schema } from "mongoose";
import { Role } from "types/db";

export const roleSchema = new Schema<Role>({
  name: String,
});

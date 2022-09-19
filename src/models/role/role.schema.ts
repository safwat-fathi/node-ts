import { Schema } from "mongoose";
import { Role } from "types/db.types";

export const roleSchema = new Schema<Role>({
  name: String,
});

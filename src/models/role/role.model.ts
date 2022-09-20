import { model } from "mongoose";
import { Role } from "types/db";
import { roleSchema } from "./role.schema";

export const RoleModel = model<Role>("Role", roleSchema);

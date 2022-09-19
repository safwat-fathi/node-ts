import { model } from "mongoose";
import { Role } from "types/db.types";
import { roleSchema } from "./role.schema";

export const RoleModel = model<Role>("Role", roleSchema);

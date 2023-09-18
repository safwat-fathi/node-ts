import { model } from "mongoose";
import { UploadDoc } from "@/types/db";
import { UploadSchema } from "./uploads.schema";

export const UploadModel = model<UploadDoc>("Upload", UploadSchema);

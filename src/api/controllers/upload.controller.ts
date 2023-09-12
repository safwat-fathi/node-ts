import { asyncHandler } from "@/api/middlewares/async.middleware";
import { upload } from "@/config/upload.config";

// * Upload Single
// * ----------
export const uploadSingle = asyncHandler(upload.single("file"));

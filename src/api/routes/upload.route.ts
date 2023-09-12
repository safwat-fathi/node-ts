import { Router } from "express";
import { verifyToken } from "@/api/middlewares/auth.middleware";
import { uploadSingle } from "../controllers/upload.controller";
import { uploadHandler } from "../middlewares/upload.middleware";
import { upload } from "@/config/upload.config";

const uploads = Router();

// * Upload Single
// * ----------
// uploads.post("/single", verifyToken, uploadSingle, uploadHandler);
uploads.post("/single", verifyToken, upload.single("file"), uploadHandler);

export default uploads;

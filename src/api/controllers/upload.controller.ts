import { asyncHandler } from "@/api/middlewares/async.middleware";
import { upload } from "@/config/upload.config";
import { UploadService } from "@/services/upload.service";
import { Upload } from "@/types/db";
import { Request, Response } from "express";

const uploadService = new UploadService();

// * Upload Single
// * ----------
export const uploadSingle = asyncHandler(
  async (req: Request, res: Response) => {
    const { file } = req;

    if (!file) {
      return res
        .status(400)
        .send({ success: false, message: res.__("upload-error") });
    }

    const newFile = await uploadService.add(file);

    res.status(200).json({
      success: true,
      message: res.__("upload-success"),
      data: newFile,
    });
  }
);

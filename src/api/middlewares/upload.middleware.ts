import path from "path";
import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "./async.middleware";
import { Upload } from "@/types/db";
import { fileExist } from "@/lib/utils/fs";
import { existsSync } from "fs";

export const checkFileExist = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    // const { file } = req;
    // console.log("🚀 ~  file:", file);
    // if (!file) {
    //   return res
    //     .status(400)
    //     .send({ success: false, message: res.__("upload-error") });
    // }
    // res.status(200).json({
    //   success: true,
    //   message: res.__("upload-success"),
    //   // data: newFile,
    // });
  }
);

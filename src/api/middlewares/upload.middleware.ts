import { Request, Response } from "express";

export const uploadHandler = (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ success: false, message: res.__("upload-error") });
  }

  res.status(200).json({
    success: true,
    message: res.__("upload-success"),
  });
};

import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("from error middlware");
  // console.log(req.url);

  next();
};

import { Request, Response, NextFunction } from "express";

export const test = (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "This is test",
  });

  next();
};

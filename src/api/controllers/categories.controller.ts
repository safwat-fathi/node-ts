import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "api/middlewares/async.middleware";

export const index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      data: res.locals.dataPaginated.data,
      meta: res.locals.dataPaginated.meta,
      links: res.locals.dataPaginated.links,
    });
  }
);

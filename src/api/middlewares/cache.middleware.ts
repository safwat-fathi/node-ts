import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./async.middleware";
import { getCacheKey } from "@/lib/utils/redis";

export const cached = () =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Get cache key
    // const key = getCacheKey(req);
    const { key } = req.query;
    console.log("🚀 ~ asyncHandler ~ key:", key);

    // res.locals.cache = { data };

    next();
  });

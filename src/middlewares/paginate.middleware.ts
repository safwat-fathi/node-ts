import { NextFunction, Request, Response } from "express";
import { StoreDB } from "types/db";
import { asyncHandler } from "./async.middleware";

export const paginate = <T>(store: StoreDB<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sortBy, sortType, skip, limit, page } = req.params as {
      skip: string;
      limit: string;
      page: string;
      sortBy: string;
      sortType: "ascend" | "descend";
    };

    const { data, meta } = await store.index(+skip, +limit, +page, {
      by: sortBy || "default",
      type: sortType || "descend",
    });
    // {by: sortBy, type: sortType }
    res.locals.dataPaginated = { data, meta, links: {} };

    next();
  });

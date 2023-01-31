import { NextFunction, Request, Response } from "express";
import { StoreDB } from "types/db";
import { asyncHandler } from "./async.middleware";

export const paginate = <T>(index: StoreDB<T>["index"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sortBy, sortType, skip, limit, page } = req.params as {
      skip: string;
      limit: string;
      page: string;
      sortBy: string;
      sortType: "ascend" | "descend";
    };

    const { data, meta } = await index(+skip, +limit, +page, {
      by: sortBy || "default",
      type: sortType || "descend",
    });

    res.locals.dataPaginated = { data, meta, links: {} };

    next();
  });

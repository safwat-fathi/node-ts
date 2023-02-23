import { NextFunction, Request, Response } from "express";
import { StoreDB, TSortOrder } from "types/db";
import { asyncHandler } from "./async.middleware";
import { createHash } from "crypto";

export const paginate = <T>(index: StoreDB<T>["index"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sortBy, sortType, skip, limit, page } = req.query as {
      skip: string;
      limit: string;
      page: string;
      sortBy: string;
      sortType: TSortOrder;
    };
    console.log("🚀 ~ asyncHandler ~ req.query:", req.query);

    const PAGE_SIZE = +limit || 10;
    const SKIP = +skip || (+page - 1) * PAGE_SIZE;
    const sort = sortBy
      ? {
          by: sortBy,
          type: sortType || "descend",
        }
      : null;

    const [data, count] = await index(SKIP, PAGE_SIZE, sort);

    // hashing data to help client identify data has changed
    const data_stringified = JSON.stringify(data);
    const data_hash = createHash("md5")
      .update(data_stringified)
      .copy()
      .digest("hex");

    const meta = {
      current_page: page,
      total_pages: Math.ceil(count / PAGE_SIZE),
      hash: data_hash,
    };

    res.locals.dataPaginated = { data, meta, links: {} };

    next();
  });

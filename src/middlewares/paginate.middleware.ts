import { NextFunction, Request, Response } from "express";
import { StoreDB } from "types/db";
import { asyncHandler } from "./async.middleware";
import { createHash } from "crypto";

export const paginate = <T>(index: StoreDB<T>["index"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sortBy, sortType, skip, limit, page } = req.params as {
      skip: string;
      limit: string;
      page: string;
      sortBy: string;
      sortType: "ascend" | "descend";
    };

    const PAGE_SIZE = +limit || 10;
    const SKIP = skip || (+page - 1) * PAGE_SIZE;

    const [data, count] = await index(+SKIP, PAGE_SIZE, {
      by: sortBy || "default",
      type: sortType || "descend",
    });

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

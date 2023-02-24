import { NextFunction, Request, Response } from "express";
import { StoreDB, TSortOrder } from "types/db";
import { asyncHandler } from "./async.middleware";
import { createHash } from "crypto";
import { HttpError } from "lib/classes/errors/http";

export const paginate = <T>(index: StoreDB<T>["index"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sortBy, sortOrder, skip, limit, page } = { ...req.query } as {
      skip: string;
      limit: string;
      page: string;
      sortBy: string;
      sortOrder: TSortOrder;
    };

    const PAGE_SIZE = +limit || 10;
    const SKIP = +skip || (+page - 1) * PAGE_SIZE;
    const sort =
      sortBy && sortOrder
        ? {
            by: sortBy,
            type: sortOrder || "descend",
          }
        : null;

    const [data, count] = await index(SKIP, PAGE_SIZE, sort);

    const current_page = +page;
    const total_pages = Math.ceil(count / PAGE_SIZE);

    if (current_page > total_pages) {
      next(
        new HttpError(
          404,
          `Page requested not found current total pages is: ${total_pages}`
        )
      );
    }

    // hashing data to help client identify data has changed
    const data_stringified = JSON.stringify(data);
    const data_hash = createHash("md5")
      .update(data_stringified)
      .copy()
      .digest("hex");

    const meta = {
      current_page,
      total_pages,
      hash: data_hash,
    };

    res.locals.dataPaginated = { data, meta, links: {} };

    next();
  });

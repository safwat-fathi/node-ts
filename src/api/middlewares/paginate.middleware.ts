import { NextFunction, Request, Response } from "express";
import { Product, StoreDB, TSortOrder } from "types/db";
import { asyncHandler } from "./async.middleware";
import { createHash } from "crypto";
import { HttpError } from "lib/classes/errors/http";
import { QuerySelector } from "mongoose";

export const paginate = <T>(index: StoreDB<T>["index"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { skip, limit, page, sort, filter } = {
      ...req.query,
    } as {
      skip: string;
      limit: string;
      page: string;
      sort: any;
      filter: any;
    };

    const PAGE_SIZE = +limit || 10;
    const SKIP = +skip || (+page - 1) * PAGE_SIZE;

    const [data, count] = await index(SKIP, PAGE_SIZE, sort, filter);

    const current_page = +page;
    const total_pages = Math.ceil(count / PAGE_SIZE);

    if (!page || +page <= 0) {
      next(new HttpError(404, `Page requested not found`));
    }

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

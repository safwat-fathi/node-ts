import { NextFunction, Request, Response } from "express";
import { Service, TSortBy } from "types/db";
import { asyncHandler } from "./async.middleware";
import { createHash } from "crypto";
import { HttpError } from "lib/classes/errors/http";
import { processQuery } from "lib/utils/mongoose";

export const paginate = <T>(index: Service<T>["index"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { skip, limit, page, sort, filter } = {
      ...req.query,
    } as {
      skip: string;
      limit: string;
      page: string;
      sort: TSortBy | null;
      filter: any | null;
    };
    // process filter to match mongo query operators
    const filterQueryProcessed = processQuery(filter);

    const PAGE_SIZE = +limit || 10;
    const SKIP = +skip || (+page - 1) * PAGE_SIZE;

    const [data, count] = await index(
      SKIP,
      PAGE_SIZE,
      sort,
      filterQueryProcessed
    );

    const current_page = +page;
    const total_pages = Math.ceil(count / PAGE_SIZE);

    if (!current_page || current_page <= 0) {
      next(new HttpError(404, `Page requested not valid or no page provided`));
    }

    // if (current_page > total_pages) {
    //   next(
    //     new HttpError(
    //       404,
    //       `Page requested not found, current total pages is: ${total_pages}`
    //     )
    //   );
    // }

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

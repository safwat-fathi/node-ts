import { NextFunction, Request, Response } from "express";
import { StoreDB } from "types/db";
import { asyncHandler } from "./async.middleware";

export const filter = <T>(store?: StoreDB<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const params = req.query as Record<string, any>;

    // omit the params used for pagination
    ["skip", "limit", "page", "sortBy", "sortType"].forEach(
      (param: string) => delete params[param]
    );

    console.log(params);

    next();
    // const data = await store.filter();

    // // return res.status(200).json({ success: true, data, meta, links: {} });
    // res.locals.dataPaginated = { data, meta, links: {} };
    // next();
  });

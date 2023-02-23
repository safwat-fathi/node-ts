import { NextFunction, Request, Response } from "express";
import { StoreDB, TFindBy, TQuery } from "types/db";
import { asyncHandler } from "./async.middleware";

export const filter = <T>(filter: StoreDB<T>["filter"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const params = req.query as TQuery<T>;

    // omit the params used for pagination
    ["skip", "limit", "page", "sortBy", "sortType"].forEach(
      (param: string) => delete params[param]
    );

    console.log("params after filter", params);

    // const data = await filter(params);

    next();

    // // return res.status(200).json({ success: true, data, meta, links: {} });
    // res.locals.dataPaginated = { data, meta, links: {} };
    // next();
  });

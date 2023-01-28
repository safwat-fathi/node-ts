import { NextFunction, Request, Response } from "express";
import { StoreDB } from "types/db";
import { asyncHandler } from "./async.middleware";

export const paginate = <T>(store: StoreDB<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { skip, limit, page } = req.params as {
      skip: string;
      limit: string;
      page: string;
    };

    // const dbStore = new store();

    // * using skip & limit
    // const {data, meta} = await dbStore.index(parseInt(skip), parseInt(limit));
    // * using page number
    const { data, meta } = await store.index(+skip, +limit, +page);

    // return res.status(200).json({ success: true, data, meta, links: {} });
    res.dataPaginated = { data, meta, links: {} };

    next();
  });

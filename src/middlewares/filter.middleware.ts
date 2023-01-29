import { NextFunction, Request, Response } from "express";
import { StoreDB } from "types/db";
import { asyncHandler } from "./async.middleware";

export const sort = <T>(store: StoreDB<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // const { sortBy } = req.params as {
    //   sortBy: string;
    // };
    // const { data, meta } = await store.index();
    // // return res.status(200).json({ success: true, data, meta, links: {} });
    // res.locals.dataPaginated = { data, meta, links: {} };
    // next();
  });

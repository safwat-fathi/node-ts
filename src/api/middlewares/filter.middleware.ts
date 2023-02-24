import { NextFunction, Request, Response } from "express";
import { PAGINATION_PARAMS } from "lib/constants";
import { StoreDB, TFindBy, TQuery } from "types/db";
import { asyncHandler } from "./async.middleware";
import { ProductsModel } from "api/models/products/products.model";

export const filter = <T>(filter: StoreDB<T>["filter"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const params = { ...req.query } as TQuery<T>;
    // console.log("🚀 ~ asyncHandler ~ params.foo:", params.foo);
    // console.log(
    //   "🚀 ~ asyncHandler ~ params.foo:",
    //   Array.isArray(JSON.parse(params.foo))
    //     ? JSON.parse(params.foo)[0]
    //     : params.foo
    // );

    const foo = JSON.parse(params.foo);

    const data = await ProductsModel.find({})
      .where("price")
      .gte(foo[0])
      .lte(foo[1]);
    console.log("🚀 ~ asyncHandler ~ data:", data);

    // omit the params used for pagination
    PAGINATION_PARAMS.forEach((param: string) => delete params[param]);

    await filter(params);

    next();

    // // return res.status(200).json({ success: true, data, meta, links: {} });
    // res.locals.dataPaginated = { data, meta, links: {} };
    // next();
  });

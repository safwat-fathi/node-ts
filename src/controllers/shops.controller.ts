import { NextFunction, Request, Response } from "express";
import { ShopsStore } from "models/stores/shops.model";
import { HttpError } from "errors/http";
import { asyncHandler } from "middlewares/async.middleware";

// * Index
// * ----------
export const index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { location, distance } = req.params as {
      location: unknown;
      distance: string;
      // skip: string;
      // limit: string;
      // page: string;
    };

    // check location
    // if (!location || !Array.isArray(location)) {
    //   return next(new HttpError(400, `must use location`));
    // }
    // // check distance
    // if (!location || !Array.isArray(location)) {
    //   return next(new HttpError(400, `must use location`));
    // }

    // const shopStore = new ShopsStore();

    // * using skip & limit
    // const products = await shopStore.index(parseInt(skip), parseInt(limit));
    // * using page number
    // const { data, meta } = await shopStore.index(
    //   null,
    //   null,
    //   // +page,
    //   // location as [string, string],
    //   // +distance
    // );

    return res
      .status(200)
      .json({
        success: true,
        data: res.dataPaginated.data,
        meta: res.dataPaginated.meta,
        links: res.dataPaginated.links,
      });
  }
);

import { NextFunction, Request, Response } from "express";
// import { ShopsStore } from "models/stores/shops.model";
// import { HttpError } from "errors/http";
import { asyncHandler } from "middlewares/async.middleware";

// * Index
// * ----------
export const index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { location, distance } = req.params as {
    //   location: unknown;
    //   distance: string;
    // };

    // check location
    // if (!location || !Array.isArray(location)) {
    //   return next(new HttpError(400, `must use location`));
    // }
    // // check distance
    // if (!location || !Array.isArray(location)) {
    //   return next(new HttpError(400, `must use location`));
    // }

    return res.status(200).json({
      success: true,
      data: res.locals.dataPaginated.data,
      meta: res.locals.dataPaginated.meta,
      links: res.locals.dataPaginated.links,
    });
  }
);

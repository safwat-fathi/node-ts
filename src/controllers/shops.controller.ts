import { NextFunction, Request, Response } from "express";
import { ShopsModel, ShopsStore } from "models/stores/shops.model";
import { ShopsSchema } from "models/stores/shops.schema";
import { HttpError } from "errors/http";
import { asyncHandler } from "middlewares/async.middleware";

// * Index
// * ----------
export const index = asyncHandler(async (req: Request, res: Response) => {
  const { skip, limit, page } = req.params;

  const productStore = new ShopsStore();

  // * using skip & limit
  // const products = await productStore.index(parseInt(skip), parseInt(limit));
  // * using page number
  const data = await productStore.index(null, null, parseInt(page));

  // if (data.products.length === 0) {
  //   return res
  //     .status(200)
  //     .json({ success: true, data: [] });
  // }

  return res.status(200).json({ success: true, data, links: {} });
});

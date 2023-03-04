import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "models/categories/categories.model";
import { ProductModel } from "models/products/products.model";
import { CategoryDoc, Product } from "types/db";
import { HttpError } from "lib/classes/errors/http";
import { asyncHandler } from "api/middlewares/async.middleware";
import { ProductService } from "services/products.service";

// * Index
// * ----------
export const index = asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: res.locals.dataPaginated.data,
    meta: res.locals.dataPaginated.meta,
    links: res.locals.dataPaginated.links,
  });
});

// * CREATE
// * ----------
export const create = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.body as Product;

    const productService = new ProductService();

    // check if there is a category match the passed one
    const categoriesFound: CategoryDoc[] = await CategoryModel.find({
      _id: { $in: category },
    });

    if (categoriesFound && categoriesFound.length === 0) {
      return next(new HttpError(404, "No categories match passed categories"));
    }

    const newProduct = await productService.create(req.body);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  }
);

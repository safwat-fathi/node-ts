import { NextFunction, Request, Response } from "express";
import { CategoryDoc, Product } from "@/types/db";
import { HttpError } from "@lib/classes/errors/http";
import { asyncHandler } from "@api/middlewares/async.middleware";
import { ProductService } from "@services/products.service";
import { CategoryService } from "@services/categories.service";

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
    const { categories } = req.body as Product;

    const productService = new ProductService();
    const categoryService = new CategoryService();

    const [categoriesFound, count] = await categoryService.index(
      null,
      null,
      null,
      {
        _id: { $in: categories },
      }
    );

    if (!categoriesFound || count === 0) {
      return next(new HttpError(429, "No categories match passed categories"));
    }

    const newProduct = await productService.create(req.body);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  }
);

import { NextFunction, Request, Response } from "express";
import { Product, Service } from "@/types/db";
import { HttpError } from "@/lib/classes/errors/http";
import { asyncHandler } from "@/api/middlewares/async.middleware";
import { ProductService } from "@/services/products.service";
import { CategoryService } from "@/services/categories.service";

const productService = new ProductService();
const categoryService = new CategoryService();

// * Index
// * ----------
// export const index = <T>(index: Service<T>["index"]) =>
//   asyncHandler(async (_, res: Response) => {
//     const [data, count] = await index();

//     return res.status(200).json({
//       success: true,
//       data,
//       meta: { count },
//     });
//   });

// * Index with pagination
// * ----------
export const indexPaginated = asyncHandler(async (_, res: Response) => {
  return res.status(200).json({
    success: true,
    data: res.locals.dataPaginated.data,
    meta: res.locals.dataPaginated.meta,
    links: res.locals.dataPaginated.links,
  });
});

// * GET
// * ----------
export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const product = await productService.find(slug as string);

    if (!product) {
      return next(
        new HttpError(404, res.__("no-product-match", { product: slug }))
      );
    }

    res.status(201).json({
      success: true,
      data: product,
    });
  }
);

// * CREATE
// * ----------
export const create = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categories } = req.body as Product;

    const [categoriesFound, count] = await categoryService.index(
      null,
      null,
      null,
      {
        _id: { $in: categories },
      }
    );

    if (!categoriesFound || count === 0) {
      return next(new HttpError(429, `No categories match ${categories}`));
    }

    const newProduct = await productService.create(req.body);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  }
);

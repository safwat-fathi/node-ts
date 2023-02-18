import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "models/categories/categories.model";
import { ProductsStore, ProductsModel } from "models/products/products.model";
import { CategoryDoc, Product } from "types/db";
import { HttpError } from "errors/http";
import { asyncHandler } from "middlewares/async.middleware";

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

// * SEARCH
// * ----------
export const findByCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const products = await ProductsModel.find({ categories: categoryId });

    if (products.length === 0) {
      return next(new HttpError(404, `No products match this search`));
    }

    res.status(200).json({
      success: true,
      data: products,
      message: `Found ${products.length} products`,
    });
  }
);

export const findByName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;

    const products = await ProductsModel.find({ categories: categoryId });

    if (products.length === 0) {
      return next(new HttpError(404, `No products match this search`));
    }

    res.status(200).json({
      success: true,
      data: products,
      message: `Found ${products.length} products`,
    });
    console.log(products);
  }
);

// * CREATE
// * ----------
export const addProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categories } = req.body as Product;

    const productsStore = new ProductsStore();

    // check if there is a category match the passed one
    const categoriesFound: CategoryDoc[] = await CategoryModel.find({
      _id: { $in: categories },
    });

    if (categoriesFound && categoriesFound.length === 0) {
      return next(new HttpError(404, "No categories match passed categories"));
    }

    const newProduct = await productsStore.create(req.body);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  }
);

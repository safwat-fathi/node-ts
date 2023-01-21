import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "models/categories/categories.model";
import { ProductModel } from "models/products/products.model";
import { Category } from "types/db";
import { ProductStore } from "models/products/products.model";
import { HttpError } from "errors/http";
import { asyncHandler } from "middlewares/async.middleware";

// * Index
// * ----------
export const index = asyncHandler(async (req: Request, res: Response) => {
  const { skip, limit, page } = req.params;

  const productStore = new ProductStore();

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

// * SEARCH
// * ----------
export const findByCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const products = await ProductModel.find({ categories: categoryId });

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

    const products = await ProductModel.find({ categories: categoryId });

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
    const { categories } = req.body;

    // check if there is a category match the passed one
    const categoriesFound: Category[] = await CategoryModel.find({
      _id: { $in: categories },
    });

    if (categoriesFound && categoriesFound.length === 0) {
      return next(new HttpError(404, "No categories match passed categories"));
    }

    const newProduct = await ProductModel.create({
      ...req.body,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  }
);

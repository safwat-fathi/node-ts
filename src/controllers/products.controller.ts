import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "models/categories/categories.model";
import { ProductModel } from "models/products/products.model";
import { Category } from "types/db";
import { ProductStore } from "models/products/products.model";
import { HttpError } from "errors/http";

// * Index
// * ----------
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { skip, limit, page } = req.params;

  const productStore = new ProductStore();

  try {
    // * using skip & limit
    // const products = await productStore.index(parseInt(skip), parseInt(limit));
    // * using page number
    const data = await productStore.index(null, null, parseInt(page));

    if (data.products.length === 0) {
      return res
        .status(200)
        .json({ success: true, data: [], message: `No products found` });
    }

    return res.status(200).json({ success: true, ...data, links: {} });
  } catch (err) {
    next(new HttpError(500, `${err}`));
  }
};

// * SEARCH
// * ----------
export const findByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    next(new HttpError(500, `${err}`));
  }
};

export const findByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categoryId = req.params.categoryId;

  try {
    const products = await ProductModel.find({ categories: categoryId });

    if (products.length === 0) {
      res.status(200).json({
        success: false,
        error: { message: `No products match this search` },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: products,
      message: `Found ${products.length} products`,
    });
    console.log(products);
  } catch (err) {
    next(new HttpError(500, `${err}`));
  }
};

// * CREATE
// * ----------
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categories } = req.body;

  try {
    // check if there is a category match the passed one
    const categoriesFound: Category[] = await CategoryModel.find({
      _id: { $in: categories },
    });

    if (categoriesFound && categoriesFound.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: "No categories match passed categories",
        },
      });
      return;
    }

    const newProduct = await ProductModel.create({
      ...req.body,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (err) {
    next(new HttpError(500, `${err}`));
  }
};

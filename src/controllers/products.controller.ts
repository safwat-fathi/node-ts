import { Request, Response } from "express";
import { CategoryModel } from "models/categories/categories.model";
import { ProductModel } from "models/products/products.model";
import { Category } from "types/db";

// * SEARCH
// * ----------
export const findByCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;

  try {
    const products = await ProductModel.find({ categories: categoryId });

    if (products.length === 0) {
      res.status(200).json({ message: `No products match this search` });
      return;
    }

    res
      .status(200)
      .json({ data: products, message: `Found ${products.length} products` });
    console.log(products);
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }
};

export const findByName = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;

  try {
    const products = await ProductModel.find({ categories: categoryId });

    if (products.length === 0) {
      res.status(200).json({ message: `No products match this search` });
      return;
    }

    res
      .status(200)
      .json({ data: products, message: `Found ${products.length} products` });
    console.log(products);
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }
};

// * CREATE
// * ----------
export const addProduct = async (req: Request, res: Response) => {
  const { categories } = req.body;

  try {
    // check if there is a category match the passed one
    const categoriesFound: Category[] = await CategoryModel.find({
      _id: { $in: categories },
    });

    if (categoriesFound && categoriesFound.length === 0) {
      res
        .status(404)
        .json({ message: "No categories match passed categories" });
      return;
    }

    const newProduct = await ProductModel.create({
      ...req.body,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ data: newProduct, message: "Product created successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

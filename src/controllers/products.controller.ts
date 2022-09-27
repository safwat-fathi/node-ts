import { Request, Response } from "express";
import { ProductModel } from "models/products/products.model";
import { CategoryModel } from "models/categories/categories.model";
import mongoose from "mongoose";

export const findCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      res.status(200).json({ message: `No category found` });
      return;
    }

    res.status(200).json({ data: category, message: `Found category` });
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }
};

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

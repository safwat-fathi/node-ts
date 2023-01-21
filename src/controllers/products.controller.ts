import { Request, Response } from "express";
import { CategoryModel } from "models/categories/categories.model";
import { ProductModel } from "models/products/products.model";
import { Category } from "types/db";
import { ProductStore } from "models/products/products.model";
// * Index
// * ----------
export const index = async (req: Request, res: Response) => {
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
    return res.status(500).json({ success: false, message: err });
  }
};

// * SEARCH
// * ----------
export const findByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const products = await ProductModel.find({ categories: categoryId });

    if (products.length === 0) {
      res
        .status(200)
        .json({ success: true, message: `No products match this search` });
      return;
    }

    res.status(200).json({
      success: true,
      data: products,
      message: `Found ${products.length} products`,
    });
    console.log(products);
  } catch (err) {
    res.status(500).json({ success: false, message: err });
    return;
  }
};

export const findByName = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;

  try {
    const products = await ProductModel.find({ categories: categoryId });

    if (products.length === 0) {
      res
        .status(200)
        .json({ success: false, message: `No products match this search` });
      return;
    }

    res.status(200).json({
      success: true,
      data: products,
      message: `Found ${products.length} products`,
    });
    console.log(products);
  } catch (err) {
    res.status(500).json({ success: false, message: err });
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
      res.status(404).json({
        success: false,
        message: "No categories match passed categories",
      });
      return;
    }

    const newProduct = await ProductModel.create({
      ...req.body,
    });

    await newProduct.save();

    res.status(201).json({
      success: false,
      data: newProduct,
      message: "Product created successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

import { Request, Response } from "express";
import { CategoryModel } from "models/categories/categories.model";

export const findCategoryByName = async (req: Request, res: Response) => {
  const categoryName = req.params.categoryName;

  try {
    const category = await CategoryModel.findOne({
      name: new RegExp(categoryName, "i"),
    });

    if (!category) {
      res.status(404).json({ success: false, message: `Not found` });
      return;
    }

    res
      .status(200)
      .json({ success: true, data: category, message: `Category found` });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

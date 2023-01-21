import { HttpError } from "errors/http";
import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "models/categories/categories.model";

export const findCategoryByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categoryName = req.params.categoryName;

  try {
    const category = await CategoryModel.findOne({
      name: new RegExp(categoryName, "i"),
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: { message: `Not found` } });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(new HttpError(500, `${err}`));
  }
};

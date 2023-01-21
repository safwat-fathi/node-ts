import { HttpError } from "errors/http";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "middlewares/async.middleware";
import { CategoryModel } from "models/categories/categories.model";

export const findCategoryByName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryName = req.params.categoryName;

    const category = await CategoryModel.findOne({
      name: new RegExp(categoryName, "i"),
    });

    if (!category) {
      return new HttpError(404, "Not found");
    }

    res.status(200).json({ success: true, data: category });
  }
);

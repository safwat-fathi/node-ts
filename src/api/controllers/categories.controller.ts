import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "src/api/middlewares/async.middleware";
import { HttpError } from "src/lib/classes/errors/http";
import { Category } from "src/types/db";
import { CategoryService } from "src/services/categories.service";

export const index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      data: res.locals.dataPaginated.data,
      meta: res.locals.dataPaginated.meta,
      links: res.locals.dataPaginated.links,
    });
  }
);

export const create = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, parent, sub } = req.body as Category;

    if (!name || !description) {
      throw new HttpError(400, `name or description not valid`);
    }

    const categoryService = new CategoryService();

    const newCategory = await categoryService.create({
      name,
      description,
      parent,
      sub,
    });

    if (!newCategory) {
      throw new HttpError(500, `Something went wrong`);
    }

    return res.status(200).json({
      success: true,
      data: newCategory,
    });
  }
);

export const update = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, parent, sub } = req.body as Category;

    if (!name || !description) {
      throw new HttpError(400, `name or description not valid`);
    }

    const categoryService = new CategoryService();

    const updatedCategory = await categoryService.update({
      name,
      description,
      parent,
      sub,
    });

    if (!updatedCategory) {
      throw new HttpError(400, `Category ${name} not found`);
    }

    return res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  }
);

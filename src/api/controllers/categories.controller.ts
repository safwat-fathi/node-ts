import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "@api/middlewares/async.middleware";
import { HttpError } from "@lib/classes/errors/http";
import { Category } from "@/types/db";
import { CategoryService } from "@services/categories.service";

const categoryService = new CategoryService();

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

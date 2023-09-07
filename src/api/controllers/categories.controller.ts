import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "@/api/middlewares/async.middleware";
import { HttpError } from "@/lib/classes/errors/http";
import { Category } from "@/types/db";
import { CategoryService } from "@/services/categories.service";

const categoryService = new CategoryService();

// * Index
// * ----------
export const index = asyncHandler(async (_, res: Response) => {
  const data = await categoryService.index();

  return res.status(200).json({
    success: true,
    data,
  });
});

// * Index with pagination
// * ----------
export const indexPaginated = asyncHandler(async (_, res: Response) => {
  return res.status(200).json({
    success: true,
    data: res.locals.dataPaginated.data,
    meta: res.locals.dataPaginated.meta,
    links: res.locals.dataPaginated.links,
  });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
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
});

export const update = asyncHandler(async (req: Request, res: Response) => {
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
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new HttpError(400, `Provide valid category id`);
  }

  await categoryService.delete(id);

  return res.status(200).json({
    success: true,
    message: "deleted successfully",
  });
});

import { NextFunction, Request, Response } from "express";
import { UserModel } from "models/user/user.model";
import { HttpError } from "errors/http";

// * SEARCH
// * ---------
export const findBySubId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserModel.find({ subscription: req.params.subId });

    if (!users) {
      return next(new HttpError(404, "Nothing found"));
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(new HttpError(500, `${err}`));
  }
};

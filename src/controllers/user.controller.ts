import { NextFunction, Request, Response } from "express";
import { UserModel } from "models/user/user.model";
import { HttpError } from "errors/http";
import { asyncHandler } from "middlewares/async.middleware";

// * SEARCH
// * ---------
// export const findBySubId = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const users = await UserModel.find({ subscription: req.params.subId });

//     if (!users) {
//       return next(new HttpError(404, "Nothing found"));
//     }

//     res.status(200).json({
//       success: true,
//       data: users,
//     });
//   }
// );

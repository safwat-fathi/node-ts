import dotenv from "dotenv";
import { CustomJwtPayload } from "@/types/jwt";
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import {
  JsonWebTokenError,
  TokenExpiredError,
  VerifyErrors,
  verify,
} from "jsonwebtoken";
import { HttpError } from "@/lib/classes/errors/http";
import { asyncHandler } from "./async.middleware";
import { UserService } from "@/services/user.service";

dotenv.config();

const SECRET = (process.env.SECRET as string) || "";

// express validators
export const validateName = body("name")
  .exists()
  .bail()
  .withMessage("Name  is required")
  .isAlpha()
  .trim()
  .escape();

export const validateEmail = body("email")
  .exists()
  .withMessage("Email is required")
  .bail()
  .isEmail()
  .withMessage("Invalid email")
  .bail()
  .normalizeEmail()
  .trim()
  .escape();

export const required = (n: string) =>
  body(n).exists().withMessage(`${n} is required`);

export const validatePassword = body("password")
  .isStrongPassword({
    minLength: 8,
    minLowercase: 4,
    minUppercase: 4,
    minNumbers: 1,
    returnScore: true,
  })
  .trim()
  .escape();

export const validatePasswordMatch = body(
  "password_confirm",
  "Password confirmation is required"
).custom((value, { req }) => {
  if (!value) {
    throw new Error("Password confirm is required");
  }

  if (value !== req.body.password_confirm) {
    throw new Error("Password did not match");
  }

  return true;
});

export const validatePhone = body("phone")
  .escape()
  .exists()
  .withMessage("Phone is required")
  .bail()
  .matches(/\d{3}\s?\d{4}-?\d{4}/gm)
  .withMessage("Phone is not valid egyptian mobile number")
  .bail()
  .trim()
  .escape();

export const checkDuplicate = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const { email } = req.body;

    const userService = new UserService();

    const user = await userService.find({ email });

    if (user) {
      return next(new HttpError(409, `${email} is already in use`));
    }

    next();
  }
);

// export const checkRolesExisted = asyncHandler(
//   async (req: Request, _: Response, next: NextFunction) => {
//     if (req.body.roles) {
//       for (let i = 0; i < req.body.roles.length; i++) {
//         if (!["user", "admin", "moderator"].includes(req.body.roles[i])) {
//           return next(
//             new HttpError(
//               400,
//               `Failed! Role ${req.body.roles[i]} does not exist!`
//             )
//           );
//         }
//       }
//     }

//     next();
//   }
// );

export const verifyToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers["authorization"];

    if (!bearerToken) {
      return next(new HttpError(401, res.__("unauthorized")));
    }

    const token = bearerToken.replace("Bearer ", "");

    verify(token, SECRET, (err, decoded) => {
      const isExpired = err instanceof TokenExpiredError;

      // if (!decoded) {
      //   return next(new HttpError(401, res.__("invalid-token")));
      // }

      if (isExpired) {
        return next(new HttpError(401, res.__("token-expired")));
      }

      if (!(decoded as CustomJwtPayload).id) {
        return next(new HttpError(403, res.__("access-forbidden")));
      }

      if (err) {
        return next(new HttpError(500, res.__("server-error")));
      }
    });

    next();
  }
);

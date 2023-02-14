import dotenv from "dotenv";
import { CustomJwtPayload } from "types/jwt";
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { verify } from "jsonwebtoken";
import { UserStore } from "models/user/user.model";
// import { SubscriptionStore } from "models/subscription/subscription.model";
import { HttpError } from "errors/http";
import { asyncHandler } from "./async.middleware";
import { User } from "types/db";

dotenv.config();

const secret = (process.env.SECRET as string) || "";

export const checkDuplicate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone } = req.body as { email: string; phone: string };

    const userStore = new UserStore();

    const user = await userStore.find([
      { by: "email", value: email },
      { by: "phone", value: phone },
    ]);

    if (user) {
      return next(
        new HttpError(400, "Sorry, email or phone is already in use!")
      );
    }

    next();
  }
);

// export const validateSubscription = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const email = await UserModel.findOne({
//       name: req.body.email,
//     });

//     const phone = await UserModel.findOne({
//       phone: req.body.phone,
//     });

//     if (phone || email) {
//       return next(
//         new HttpError(400, "Sorry, email or phone is already in use!")
//       );
//     }

//     next();
//   }
// );

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

export const checkRolesExisted = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!["user", "admin", "moderator"].includes(req.body.roles[i])) {
          return next(
            new HttpError(
              400,
              `Failed! Role ${req.body.roles[i]} does not exist!`
            )
          );
        }
      }
    }

    next();
  }
);

export const verifyToken = asyncHandler(
  async (req: Request, _, next: NextFunction) => {
    const token: string = req.headers.authorization || "";

    if (!token) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const decoded = <CustomJwtPayload>verify(token?.split(" ")[1], secret);

    req.body.userId = decoded.id;
  }
);

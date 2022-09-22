import dotenv from "dotenv";
import { CustomJwtPayload } from "types/jwt";
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { verify } from "jsonwebtoken";
import { UserModel } from "models/user/user.model";

dotenv.config();

const secret = (process.env.SECRET as string) || "";

export const checkDuplicate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = await UserModel.findOne({
      name: req.body.name,
    });

    const phone = await UserModel.findOne({
      phone: req.body.phone,
    });

    if (email) {
      res.status(400).json({ message: "Failed! Email is already in use!" });
      return;
    }

    if (phone) {
      res.status(400).json({ message: "Failed! Email is already in use!" });
      return;
    }
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }

  next();
};

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

export const checkRolesExisted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!["user", "admin", "moderator"].includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });

        res.end();
      }
    }
  }

  next();
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers.authorization?.split("  ")[1] || "";
  console.log(token);

  if (!token) {
    res.status(401).json({ message: "Unauthorized" }).end();
    return;
  }

  try {
    const decoded = verify(token, secret) as CustomJwtPayload;

    req.body.userId = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ message: err }).end();
  }
};

import { check } from "express-validator";
import { Router } from "express";
import { signup, login } from "controllers/auth.controller";
import { checkDuplicate } from "middlewares/auth/verifyRegister.middleware";

const router = Router();

router.post(
  "/auth/signup",
  checkDuplicate,
  check("email")
    .exists()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .trim()
    .escape(),
  check(
    "password",
    "Password must be 8+ characters long and contain a number and has at least 4 lower case and 4 upper case"
  )
    .isStrongPassword({
      minLength: 8,
      minLowercase: 4,
      minUppercase: 4,
      minNumbers: 1,
    })
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .trim()
    .escape(),
  // check("password_confirm", "Password confirmation is required").custom(
  //   (value, { req }) => {
  //     if (value !== req.body.password_confirm) {
  //       throw new Error("Password confirmation does not match given password");
  //     }

  //     return true;
  //   }
  // ),
  check("phone")
    .exists()
    .withMessage("Phone is required")
    .isMobilePhone("ar-EG")
    .notEmpty()
    .trim()
    .escape(),
  check("name")
    .exists()
    .withMessage("Name  is required")
    .isAlpha()
    .notEmpty()
    .trim()
    .escape(),
  signup
);

router.post(
  "/auth/login",
  check("email", "Invalid email")
    .isEmail()
    .exists()
    .withMessage("Email is required")
    .trim()
    .escape(),
  check(
    "password",
    "Password must be 8+ characters long and contain a number and has at least 4 lower case and 4 upper case"
  )
    .isStrongPassword({
      minLength: 8,
      minLowercase: 4,
      minUppercase: 4,
      minNumbers: 1,
    })
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .escape(),
  login
);

export default router;

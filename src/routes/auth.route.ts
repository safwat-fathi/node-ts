import { check } from "express-validator";
import { Router } from "express";
import { signUp } from "controllers/auth.controller";

const router = Router();

router.post(
  "/auth/signup",
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),
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
    .not()
    .isEmpty()
    .trim()
    .escape(),
  signUp
);

export default router;

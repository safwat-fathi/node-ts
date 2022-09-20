import { body } from "express-validator";
import { Router } from "express";
import { signUp } from "controllers/auth.controller";

const router = Router();

router.post(
  "/auth/signup",
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 4,
      minUppercase: 4,
      minNumbers: 1,
    })
    .not()
    .isEmpty()
    .trim()
    .escape(),
  body("phone").isMobilePhone("ar-EG").not().isEmpty().trim().escape(),
  body("name").isAlpha().not().isEmpty().trim().escape(),
  signUp
);

export default router;

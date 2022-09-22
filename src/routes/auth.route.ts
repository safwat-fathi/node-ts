import { Router } from "express";
import { signup, login } from "controllers/auth.controller";
import {
  checkDuplicate,
  validateEmail,
  validateName,
  validatePasswordMatch,
  validatePhone,
  validatePassword,
} from "middlewares/auth/verifyRegister.middleware";

const router = Router();

router.post(
  "/auth/signup",
  checkDuplicate,
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
  signup
);

router.post("/auth/login", validateEmail, validatePassword, login);

export default router;

import { Router } from "express";
import { signup, login, logout } from "controllers/auth.controller";
import {
  checkDuplicate,
  validateEmail,
  validateName,
  validatePasswordMatch,
  validatePhone,
  validatePassword,
} from "middlewares/auth.middleware";

const router = Router();

// signup
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
// login
router.post("/auth/login", validateEmail, validatePassword, login);
// logout
router.get("/auth/logout", logout);

export default router;

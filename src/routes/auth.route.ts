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

const auth = Router();

// signup
auth.post(
  "/signup",
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
  checkDuplicate,
  signup
);
// login
auth.post("/login", login);
// logout
auth.get("/logout", logout);

export default auth;

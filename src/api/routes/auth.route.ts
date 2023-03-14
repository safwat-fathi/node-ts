import { Router } from "express";
import { signup, login, logout } from "@api/controllers/auth.controller";
import {
  validateEmail,
  validateName,
  validatePasswordMatch,
  validatePhone,
  validatePassword,
} from "@api/middlewares/auth.middleware";

const auth = Router();

// signup
auth.post(
  "/signup",
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
  signup
);
// login
auth.post("/login", login);
// logout
auth.get("/logout", logout);

export default auth;

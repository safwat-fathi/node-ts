import { Router } from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
} from "@/api/controllers/auth.controller";
import {
  validateEmail,
  validateName,
  validatePasswordMatch,
  validatePhone,
  validatePassword,
  checkDuplicate,
  verifyToken,
} from "@/api/middlewares/auth.middleware";

const auth = Router();

// signup
auth.post(
  "/signup",
  checkDuplicate,
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
auth.get("/logout", verifyToken, logout);
// forgot password
auth.post("/forgot-password", forgotPassword);

export default auth;

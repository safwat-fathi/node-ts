import { Router } from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  verification,
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

// * SIGNUP
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
// * LOGIN
auth.post("/login", login);
// * LOGOUT
auth.get("/logout", logout);
// * FORGOT PASSWORD
auth.post("/forgot-password", forgotPassword);
// * VERIFICATION
auth.get("/verification/", verifyToken, verification);

export default auth;

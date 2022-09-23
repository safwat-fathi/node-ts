import { Router } from "express";
import { findBySubId } from "controllers/user.controller";
import { verifyToken } from "middlewares/auth.middleware";

const router = Router();

router.get("/user/:subId", verifyToken, findBySubId);

export default router;

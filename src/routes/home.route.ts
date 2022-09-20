import { Router } from "express";
import { test } from "controllers/test.controller";
import { verifyToken } from "middlewares/auth/jwt.middleware";

const router = Router();

router.get("/", verifyToken, test);

export default router;

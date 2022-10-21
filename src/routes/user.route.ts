import { Router } from "express";
import { findBySubId } from "controllers/user.controller";
import { verifyToken } from "middlewares/auth.middleware";

const user = Router();

// * SEARCH
user.get("/:subId", verifyToken, findBySubId);

export default user;

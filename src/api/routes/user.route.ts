import { Router } from "express";
// import { findBySubId } from "@api/controllers/user.controller";
import { verifyToken } from "@api/middlewares/auth.middleware";

const user = Router();

// * SEARCH
// user.get("/:subId", verifyToken, findBySubId);

export default user;

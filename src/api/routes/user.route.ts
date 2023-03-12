import { Router } from "express";
// import { findBySubId } from "src/api/controllers/user.controller";
import { verifyToken } from "src/api/middlewares/auth.middleware";

const user = Router();

// * SEARCH
// user.get("/:subId", verifyToken, findBySubId);

export default user;

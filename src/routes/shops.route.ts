import { Router } from "express";
import { index } from "controllers/shops.controller";
// import { verifyToken } from "middlewares/auth.middleware";

const shops = Router();

// * INDEX
shops.get("/", index);

// * SEARCH
// shops.get("/:categoryId", findByCategory);

// * CREATE
// shops.post("/add", verifyToken, addProduct);

export default shops;

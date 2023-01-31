import { Router } from "express";
import { index } from "controllers/shops.controller";
// import { verifyToken } from "middlewares/auth.middleware";
import { paginate } from "middlewares/paginate.middleware";
import { ShopsStore } from "models/stores/shops.model";
import { Shop } from "types/db";

const shops = Router();

const shopsStore = new ShopsStore();

// * INDEX
shops.get("/", paginate<Shop>(shopsStore.index), index);

// * SEARCH
// shops.get("/:categoryId", findByCategory);

// * CREATE
// shops.post("/add", verifyToken, addProduct);

export default shops;

// import { Router } from "express";
// import { index } from "@api/controllers/shops.controller";
// import { verifyToken } from "@api/middlewares/auth.middleware";
// import { paginate } from "@api/middlewares/paginate.middleware";
// import { Shop } from "@/types/db";

// const shops = Router();

// const shopsStore = new ShopsStore();

// // * INDEX
// shops.get("/", paginate<Shop>(shopsStore.index), index);

// // * SEARCH
// // shops.get("/:categoryId", findByCategory);

// // * CREATE
// // shops.post("/add", verifyToken, addProduct);

// export default shops;

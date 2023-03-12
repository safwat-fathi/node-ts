// import { Router } from "express";
// import { index } from "src/api/controllers/shops.controller";
// import { verifyToken } from "src/api/middlewares/auth.middleware";
// import { paginate } from "src/api/middlewares/paginate.middleware";
// import { Shop } from "src/types/db";

// const shops = Router();

// const shopsStore = new ShopsStore();

// // * INDEX
// shops.get("/", paginate<Shop>(shopsStore.index), index);

// // * SEARCH
// // shops.get("/:categoryId", findByCategory);

// // * CREATE
// // shops.post("/add", verifyToken, addProduct);

// export default shops;

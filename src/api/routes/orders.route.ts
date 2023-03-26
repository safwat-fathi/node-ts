import { Router } from "express";
import { add, remove, edit } from "@api/controllers/orders.controller";
// import { verifyToken } from "@api/middlewares/auth.middleware";

const orders = Router();

// TODO: add verify token to all routes
// * READ
orders.get("/", /* verifyToken, */ index);
// * CREATE
orders.post("/", /* verifyToken, */ add);
// * EDIT
orders.put("/", /* verifyToken, */ edit);
// * DELETE
orders.delete("/:orderId", /* verifyToken, */ remove);

export default orders;

import { Router } from "express";
import { add, remove } from "@api/controllers/orders.controller";
// import { verifyToken } from "@api/middlewares/auth.middleware";

const orders = Router();

// TODO: add verify token
// * CREATE
orders.post("/", /* verifyToken, */ add);
orders.delete("/:orderId", /* verifyToken, */ remove);

export default orders;

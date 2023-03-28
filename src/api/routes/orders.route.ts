import { Router } from "express";
import { index, add, remove, edit } from "@api/controllers/orders.controller";
import { verifyToken } from "@api/middlewares/auth.middleware";
import { paginate } from "@api/middlewares/paginate.middleware";
import { OrderService } from "@/services/orders.service";
import { Order } from "@/types/db";

const orders = Router();

const orderService = new OrderService();

// TODO: add verify token to all routes
// * READ
orders.get("/", verifyToken, paginate<Order>(orderService.index), index);
// * CREATE
orders.post("/", /* verifyToken, */ add);
// * EDIT
orders.put("/", /* verifyToken, */ edit);
// * DELETE
orders.delete("/:orderId", verifyToken, remove);

export default orders;

import { Router } from "express";
import {
  index,
  add,
  remove,
  edit,
  getOrder,
  indexPaginated,
} from "@/api/controllers/orders.controller";
import { verifyToken } from "@/api/middlewares/auth.middleware";
import { paginate } from "@/api/middlewares/paginate.middleware";
import { OrderService } from "@/services/orders.service";
import { Order } from "@/types/db";

const orders = Router();

const orderService = new OrderService();

// TODO: add verify token to all routes
// * Get all
orders.get("/", verifyToken, index);

// * Index
orders.get(
  "/index",
  verifyToken,
  paginate<Order>(orderService.indexPaginated),
  indexPaginated
);

// * Get order
orders.get("/:orderId", verifyToken, getOrder);

// * CREATE
orders.post("/add", verifyToken, add);

// * EDIT
orders.put("/", verifyToken, edit);

// * DELETE
orders.delete("/:orderId", verifyToken, remove);

export default orders;

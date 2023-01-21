import { Router } from "express";
import { addOrder } from "controllers/orders.controller";
import { verifyToken } from "middlewares/auth.middleware";

const orders = Router();

// * CREATE
orders.post("/add", verifyToken, addOrder);

export default orders;

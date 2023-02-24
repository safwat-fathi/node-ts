import { Router } from "express";
import { addOrder } from "api/controllers/orders.controller";
import { verifyToken } from "api/middlewares/auth.middleware";

const orders = Router();

// * CREATE
orders.post("/add", verifyToken, addOrder);

export default orders;

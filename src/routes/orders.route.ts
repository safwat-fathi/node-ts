import { Router } from "express";
import { addOrder } from "controllers/orders.controller";

const orders = Router();

// * CREATE
orders.post("/add", addOrder);

export default orders;

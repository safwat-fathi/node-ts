import { Router } from "express";
import { create } from "@api/controllers/orders.controller";
// import { verifyToken } from "@api/middlewares/auth.middleware";

const orders = Router();

// * CREATE
orders.post("/create", /* verifyToken, */ create);

export default orders;

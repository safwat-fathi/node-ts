import { Router } from "express";
import { create } from "src/api/controllers/orders.controller";
// import { verifyToken } from "src/api/middlewares/auth.middleware";

const orders = Router();

// * CREATE
orders.post("/create", /* verifyToken, */ create);

export default orders;

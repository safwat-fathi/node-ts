import { Router } from "express";
import { addOrder } from "controllers/orders.controller";

const router = Router();

// * CREATE
router.post("/orders/add", addOrder);

export default router;

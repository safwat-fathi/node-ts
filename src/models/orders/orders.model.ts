import { model } from "mongoose";
import { Order } from "types/db";
import { OrderSchema } from "./orders.schema";

export const OrderModel = model<Order>("Order", OrderSchema);

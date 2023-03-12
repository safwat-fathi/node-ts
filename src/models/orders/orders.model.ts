import { model } from "mongoose";
import { OrderDoc } from "src/types/db";
import { OrderSchema } from "./orders.schema";

export const OrderModel = model<OrderDoc>("Order", OrderSchema);

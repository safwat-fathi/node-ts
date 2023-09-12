// * express
import { Router } from "express";
// * routes
import category from "./categories.route";
import orders from "./orders.route";
import auth from "./auth.route";
import products from "./products.route";
import notifications from "./notifications.route";
import uploads from "./upload.route";

const routes = Router();

routes.use("/auth", auth);
routes.use("/products", products);
routes.use("/orders", orders);
routes.use("/category", category);
routes.use("/notifications", notifications);
routes.use("/uploads", uploads);

export default routes;

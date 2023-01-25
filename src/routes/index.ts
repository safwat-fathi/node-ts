// * express
import { Router } from "express";
// * routes
import user from "./user.route";
import category from "./categories.route";
import orders from "./orders.route";
import auth from "./auth.route";
import products from "./products.route";
import notification from "./notifications.route";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/products", products);
routes.use("/orders", orders);
routes.use("/category", category);
routes.use("/notifications", notification);

export default routes;

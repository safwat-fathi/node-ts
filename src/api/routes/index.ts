// * express
import { Router } from "express";
// * routes

import uploads from "./upload.route";
import products from "./product.route";

const routes = Router();

routes.use("/products", products);
routes.use("/uploads", uploads);

export default routes;

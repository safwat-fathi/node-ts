// * express
import { Router } from "express";
// * routes

import uploads from "./upload.route";
import products from "./product.route";

const routes = Router();

routes.get("/status", (_, res) => {
  return res.status(200).json({
    message: "Welcome to the API",
  });
});
routes.use("/products", products);
routes.use("/uploads", uploads);

export default routes;

// * express
import { Router } from "express";

// * routes
import uploads from "./upload.route";
import products from "./product.route";
import { Worker } from "node:worker_threads";
import path from "node:path";

const routes = Router();

routes.get("/status", (_, res) => {
  const randomNumber = Math.floor(Math.random() * 100);

  return res.status(200).json({
    success: true,
    message: "status ok",
    data: { random_number: randomNumber },
  });
});
routes.use("/products", products);
routes.use("/uploads", uploads);

routes.get("/test-workers", (_, res) => {
  const workerPath = path.resolve(
    __dirname,
    process.env.NODE_ENV === "production" ? "dist/lib/workers/index.js" : "../../lib/workers/index.js"
  );
  const worker = new Worker(workerPath);

  let workerResult = 0;

  // Listen for messages from the worker
  worker.on("message", (result: string | number) => {
    workerResult = result as number;

    return res.status(200).json({
      success: true,
      message: workerResult,
    });
  });

  // Handle any errors from the worker
  worker.on("error", (err) => {
    return res.status(500).json(`Worker error: ${err}`);
  });

  // Handle worker exit
  worker.on("exit", (code) => {
    if (code !== 0) return res.status(500).json(`Worker stopped with exit code ${code}`);
  });
});

// * 404
routes.use("*", (_, res) => {
  return res.status(404).json({
    success: false,
    message: "Not found",
  });
});

export default routes;

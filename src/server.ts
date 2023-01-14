import http from "http";
import WebSocket from "ws";
import dotenv from "dotenv";
import express, { Express } from "express";
import compression from "compression";
import cors from "cors";
import { errorHandler } from "middlewares/error.middleware";
import { connectDB } from "config/db.config";
// seeders
import { seedSubscriptions } from "seeders/subscription.seeder";
import { seedCategories } from "seeders/categories.seeder";
import { seedProducts } from "seeders/products.seeder";
// routes
import routes from "routes";

dotenv.config();

const app: Express = express();
const PORT = <number>process.env.HTTP_SERVER_PORT || 8080;

// connect to DB
connectDB();

// seeders
seedSubscriptions();
seedCategories();
seedProducts();

app.use(compression());
app.use(cors());
app.use(express.json());

// routes
app.use("/api", routes);
//ErrorHandler (Should be last piece of middleware)
app.use(errorHandler);

// const server = app.listen(PORT, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
// });
const server = http.createServer(app).listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  // console.log(`WebSocket is running on port ${PORT}`);
});

export const wss = new WebSocket.Server({ server }, () => {
  console.log(`WebSocket is running at ws://localhost:8080`);
});

wss.on("connection", (ws, req) => {
  console.log("*************");
  console.log(`ws connected at: ${new Date().toLocaleString()}`);
  console.log("*************");

  ws.on("error", err => {
    console.log("Error:", err);
    // server.close(() => process.exit(1));
  });
});
// cb function accepts two params error and promise
process.on("unhandledRejection", error => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});

export default app;

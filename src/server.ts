import dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";
import compression from "compression";
import cors from "cors";
import { errorHandler } from "middlewares/error.middleware";
import { connectDB } from "config/db.config";
// seeders
import { seedCategories } from "seeders/categories.seeder";
import { seedProducts } from "seeders/products.seeder";
// routes
import routes from "routes";
import { EventEmitter } from "stream";
import WebSocketServer from "websocket";
import { seedUsers } from "seeders/users.seeder";

dotenv.config();

const app: Express = express();
const PORT = <number>process.env.HTTP_SERVER_PORT || 8080;
const SECRET = <string>process.env.SECRET || "";

// connect to DB
connectDB();

// seeders
seedCategories();
seedProducts();
seedUsers();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(session({ secret: SECRET }));
// routes
app.use("/api", routes);
//ErrorHandler (Should be last piece of middleware)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at ${PORT}`);
});

const wss = new WebSocketServer(server);
wss.attachEventListeners();

export const Notification = new EventEmitter();

// cb function accepts two params error and promise
process.on("unhandledRejection", error => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});

export default app;

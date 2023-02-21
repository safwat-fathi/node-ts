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
import { withFilters } from "models/products/products.model";

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
app.use(session({ secret: SECRET, resave: true, saveUninitialized: true }));
// routes
app.use("/api", routes);
app.use(errorHandler);
// withFilters({
//   by: "name",
//   value: ["Long Sleeve White Shirt", "Grey Sweatshirt"],
// })
//   .then(res => console.log(res))
//   .catch(err => console.log(err));
const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at ${PORT}`);
});

const wss = new WebSocketServer(server);
wss.attachEventListeners();

export const Notification = new EventEmitter();

export default app;

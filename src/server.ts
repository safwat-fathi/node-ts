import dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";
import compression from "compression";
import cors from "cors";
import { errorHandler } from "api/middlewares/error.middleware";
import { connectDB } from "config/db.config";
import mongoSanitize from "express-mongo-sanitize";
// seeders
import { seedCategories } from "lib/seeders/categories.seeder";
import { seedProducts } from "lib/seeders/products.seeder";
// routes
import routes from "api/routes";
import { EventEmitter } from "stream";
import WebSocketServer from "websocket";
import { seedUsers } from "lib/seeders/users.seeder";
import helmet from "helmet";

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
// sanitize data
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  })
);
// security headers
app.use(helmet());
app.use(session({ secret: SECRET, resave: true, saveUninitialized: true }));
// routes
app.use("/api", routes);
app.use(errorHandler);

// fix issue parsing query params array limit
// app.set("query parser", function (str: string) {
//   return qs.parse(str, { arrayLimit: 1000 });
// });

const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at ${PORT}`);
});

const wss = new WebSocketServer(server);
wss.attachEventListeners();

export const Notification = new EventEmitter();

export default app;

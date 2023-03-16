import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import express, { Express } from "express";
import session from "express-session";
import compression from "compression";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import hpp from "hpp";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler } from "@api/middlewares/error.middleware";
import { connectDB } from "@config//db.config";
// seeders
import { seedCategories } from "@lib/seeders/categories.seeder";
import { seedProducts } from "@lib/seeders/products.seeder";
// routes
import routes from "@api/routes";
import { EventEmitter } from "stream";
import WebSocketServer from "websocket";
import { seedUsers } from "@lib/seeders/users.seeder";

dotenv.config();
dotenvExpand.expand(dotenv.config());

const app: Express = express();
const PORT = <number>process.env.HTTP_SERVER_PORT || 8080;
const SECRET = <string>process.env.SECRET || "";

// connect to DB
connectDB();

// seeders
seedCategories();
seedProducts();
seedUsers();

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
// compress
app.use(compression());
// cors policy
app.use(cors());
// parse json body requests
app.use(express.json());
// prevent param pollution
app.use(hpp());
// sanitize query params of mongo operators
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.error(`This request[${key}] is sanitized`, req.query);
    },
  })
);
// security headers
app.use(helmet());
// session middleware
app.use(session({ secret: SECRET, resave: true, saveUninitialized: true }));
// error handler middleware
app.use(errorHandler);
// routes
app.use("/api", routes);

// fix issue parsing query params array limit
// app.set("query parser", function (str: string) {
//   return qs.parse(str, { arrayLimit: 1000 });
// });

const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at ${PORT}`);
});

// websocket server
const wss = new WebSocketServer(server);
wss.attachEventListeners();

export const Notification = new EventEmitter();
console.log(process.env.MONGO_DB_USER);
console.log(process.env.MONGO_URI_PROD);

process.on("uncaughtException", error => {
  console.log("Server::uncaughtException::", error);
  process.exit(1); // exit application
});

process.on("unhandledRejection", (error, promise) => {
  console.log("Server::unhandledRejection::promise", promise);
  console.log("Server::unhandledRejection::error", error);
  process.exit(1); // exit application
});

process.on("SIGTERM", error => {
  console.log("Server::SIGTERM", error);
  process.exit(0); // exit application
});

process.on("SIGINT", error => {
  console.log("Server::SIGINT", error);
  process.exit(0); // exit application
});

export default app;

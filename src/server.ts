import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import express, { Express } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import hpp from "hpp";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import { errorHandler } from "@/api/middlewares/error.middleware";
import { connectDB, MONGO_URI } from "@/config/db.config";
import i18n from "@/config/i18n.config";

// routes
import routes from "@/api/routes";
import { EventEmitter } from "stream";
import WebSocketServer from "websocket";
import path from "path";

dotenv.config();

const app: Express = express();

const PORT = <number>process.env.HTTP_SERVER_PORT || 8000;
const SECRET = <string>process.env.SECRET || "";

// connect to DB
connectDB();

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
const corsConfig: cors.CorsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

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

// use cookie-parser so server can access the necessary option to save, read and access a cookie
app.use(cookieParser());

// session middleware
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // max age is 24 hrs
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
  })
);

// i18n
app.use(i18n.init);

// routes
app.use("/api", routes);

// static paths
app.use("/api/files", express.static(path.join(__dirname, "../uploads")));

// error handler middleware
if (process.env.NODE_ENV === "development") app.use(errorHandler);

// fix issue parsing query params array limit
// app.set("query parser", function (str: string) {
//   return qs.parse(str, { arrayLimit: 1000 });
// });

const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at ${PORT}`);
});

// websocket server
const wss = new WebSocketServer(server);
wss.init();

// event emitter
export const Notification = new EventEmitter();

// exceptions handlers
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

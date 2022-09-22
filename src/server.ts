import dotenv from "dotenv";
import express, { Express } from "express";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { errorHandler } from "middlewares/error.middleware";
import { connectDB } from "config/db.config";
// seeders
import { seedSubscriptions } from "seeders/subscription.seed";

// routes
import homeRouter from "routes/test.route";
import authRouter from "routes/auth.route";
import userRouter from "routes/user.route";

dotenv.config();

const app: Express = express();
const port = (process.env.PORT as string) || 8080;
const secret = (process.env.SECRET as string) || "";

// connect to DB
connectDB();
seedSubscriptions();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret,
    saveUninitialized: false,
    resave: false,
    cookie: { httpOnly: true, maxAge: 21600000 },
  })
);
app.use(compression());
app.use(homeRouter);
app.use(authRouter);
app.use(userRouter);
//ErrorHandler (Should be last piece of middleware)
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

process.on("unhandledRejection", (error, promise) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});

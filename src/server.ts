import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { errorHandler } from "middlewares/error";
import { connectDB } from "config/db.config";
// seeders
import { seedRoles } from "seeders/roles.seed";

// routes
import homeRouter from "routes/test.route";
import authRouter from "routes/auth.route";

dotenv.config();

const app: Express = express();
const port = (process.env.PORT as string) || 8080;
const secret = (process.env.SECRET as string) || "";

// connect to DB
connectDB();
seedRoles();
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
app.use(homeRouter);
app.use(authRouter);
//ErrorHandler (Should be last piece of middleware)
app.use(errorHandler);
// app.get("/", (req: Request, res: Response) => {
//   // const newUser = userModel.create({})
//   res.send("Express + TypeScript Server");
// });

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

process.on("unhandledRejection", (error, promise) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});

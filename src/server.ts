import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
import { errorHandler } from "middlewares/error";
import { connectDB } from "config/db.config";
// seeders
import { seedRoles } from "seeders/roles.seed";

// routes
import homeRouter from "routes/home.route";
import authRouter from "routes/auth.route";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// connect to DB
connectDB();
seedRoles();
//ErrorHandler (Should be last piece of middleware)
app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use(homeRouter);
app.use(authRouter);
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

import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
import { errorHandler } from "middlewares/error";
import { connectDB } from "config/db";

// routes
import homeRouter from "routes/home.route";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// connect to DB
connectDB();

//ErrorHandler (Should be last piece of middleware)
app.use(cors());
app.use(errorHandler);
app.use(homeRouter);
// app.get("/", (req: Request, res: Response) => {
//   // const newUser = userModel.create({})
//   res.send("Express + TypeScript Server");
// });

// const server = app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
// });
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
// process.on("unhandledRejection", (error, promise) => {
//   console.log(`Logged Error: ${error}`);
//   server.close(() => process.exit(1));
// });

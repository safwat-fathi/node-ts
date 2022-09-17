import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// import { connectDB } from "@";
import { connectDB } from "config/db";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;
import { errorHandler } from "middlewares/error";

// connect to DB
connectDB();

//ErrorHandler (Should be last piece of middleware)
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

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

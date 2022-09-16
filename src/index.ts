import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connection } from "./config/db";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

connection();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

import dotenv from "dotenv";
import express, { Express } from "express";
import compression from "compression";
import cors from "cors";
// import cookieParser from "cookie-parser";
// import session from "express-session";
import { errorHandler } from "middlewares/error.middleware";
import { connectDB } from "config/db.config";
// seeders
import { seedSubscriptions } from "seeders/subscription.seeder";
import { seedCategories } from "seeders/categories.seeder";
import { seedProducts } from "seeders/products.seeder";
// routes
import routes from "routes";

dotenv.config();

const app: Express = express();
const port = (process.env.PORT as string) || 8080;
// const secret = (process.env.SECRET as string) || "";

// connect to DB
connectDB();

// seeders
seedSubscriptions();
seedCategories();
seedProducts();

app.use(compression());
app.use(cors());
app.use(express.json());
// app.use(cookieParser());
// app.use(
//   session({
//     secret,
//     saveUninitialized: false,
//     resave: false,
//     cookie: { httpOnly: true, maxAge: 21600000 },
//   })
// );

// routes
app.use("/api", routes);
//ErrorHandler (Should be last piece of middleware)
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// cb function accepts two params error and promise
process.on("unhandledRejection", (error) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});

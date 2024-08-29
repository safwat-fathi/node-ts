import APP from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = <number>process.env.HTTP_SERVER_PORT || 8080;

const app = new APP(PORT);

app.init();

import dotenv from "dotenv";
dotenv.config();
import node_geocoder, { BaseOptions, Options } from "node-geocoder";

const { MONGO_URI_DEV, GEOCODER_API_KEY } = process.env || "";
console.log("GEOCODER_API_KEY", GEOCODER_API_KEY);

const options: Options = {
  provider: "mapquest",
  // apiKey: "",
  // apiKey: <string>process.env.GEOCODER_API_KEY,
  // apiKey: "4UcpQGWpSYuNYQY04vUpP96ixN0ocXyA",
  httpAdapter: "http",
  formatter: null,
};

export const geocoder = node_geocoder(options);

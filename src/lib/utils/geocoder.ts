import dotenv from "dotenv";
import node_geocoder, { Options } from "node-geocoder";

dotenv.config();

const { GEOCODER_API_KEY, GEOCODER_API_PROVIDER } = process.env || {
  GEOCODER_API_KEY: "",
  GEOCODER_API_PROVIDER: "",
};

const options: Options = {
  provider: <"freegeoip" | "mapbox" | "locationiq" | "mapquest">(
    GEOCODER_API_PROVIDER
  ),
  apiKey: <string>GEOCODER_API_KEY,
  httpAdapter: "http",
  formatter: null,
};

export const geocoder = node_geocoder(options);

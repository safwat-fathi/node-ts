declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      HTTP_SERVER_PORT: number;
      WS_SERVER_PORT: number;
      MONGO_URI_DEV: string;
      MONGO_URI_PROD: string;
      SECRET: string;
      GEOCODER_API_KEY: string;
      GEOCODER_API_PROVIDER: string;
      GEOCODER_API_SECRET: string;
    }
  }
}

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: number;
      MONGO_URI_DEV: string;
      MONGO_URI_PROD: string;
      SECRET: string;
    }
  }
}

export {};

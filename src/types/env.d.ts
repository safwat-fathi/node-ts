declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      HTTP_SERVER_PORT: number;
      WS_SERVER_PORT: number;
      MONGO_URI_DEV: string;
      MONGO_URI_PROD: string;
      SECRET: string;
      CIPHER_TEXT_SECRET: string;
      GEOCODER_API_KEY: string;
      GEOCODER_API_PROVIDER: string;
      GEOCODER_API_SECRET: string;
      MONGO_DB_USER: string;
      MONGO_DB_PASS: string;
      SMTP_HOST: string;
      SMTP_PORT: number;
      SMTP_EMAIL: string;
      SMTP_PASSWORD: string;
      FROM_EMAIL: string;
      FROM_NAME: string;
      CLIENT_HOST_DEV: string;
      CLIENT_PORT_DEV: number;
      CLIENT_HOST_PROD: string;
      CLIENT_PORT_PROD: number;
    }
  }
}

export {};

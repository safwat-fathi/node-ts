declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";

			HTTP_SERVER_PORT: number;
			WS_SERVER_PORT: number;

			DB_TYPE: DatabaseType;
			DB_HOST: string;
			DB_PORT: number;
			DB_NAME: string;
			DB_USER: string;
			DB_PASS: string;

			REDIS_USER: string;
			REDIS_PASSWORD: string;
			REDIS_URL: string;

			SECRET: string;
			CIPHER_TEXT_SECRET: string;

			GEOCODER_API_KEY: string;
			GEOCODER_API_PROVIDER: string;
			GEOCODER_API_SECRET: string;

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

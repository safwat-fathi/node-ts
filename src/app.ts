import dotenv from "dotenv";

import express, { Express } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import { rateLimit } from "express-rate-limit";
import hpp from "hpp";
import helmet from "helmet";

import i18n from "@/config/i18n.config";

// routes
import routes from "@/api/routes";
// import { EventEmitter } from "stream";
import WebSocketServer from "websocket";
import path from "path";
import { errorHandler } from "@/lib/middlewares/error.middleware";
import { AppDataSource } from "@/config/db.config";
import { Session } from "@/entities/session.entity";
import { TypeormStore } from "connect-typeorm";
import { IncomingMessage, Server, ServerResponse } from "http";
import { DataSource } from "typeorm";

dotenv.config();

const SECRET = <string>process.env.SECRET || "";

class APP {
	private _app: Express;
	private _db: DataSource;
	private _webSocketServer: WebSocketServer | null = null;
	private _httpServer: Server<
		typeof IncomingMessage,
		typeof ServerResponse
	> | null = null;
	private _httpServerPort: number;

	constructor(httpPort: number) {
		this._app = express();
		this._app.disable("x-powered-by");

		this._db = AppDataSource;
		this._httpServerPort = httpPort;

		this.setupMiddlewares();
		this.configureRoutes();
		this.setupErrorHandling();

		this.handleExceptions();
	}

	private setupMiddlewares(): void {
		this._app.use(express.json());
		this._app.use(express.urlencoded({ extended: true }));
		this._app.use(cookieParser());
		this._app.use(compression());

		const corsConfig: CorsOptions = {
			origin: true,
			credentials: true,
		};
		this._app.use(cors(corsConfig));
		this._app.options("*", cors(corsConfig));

		this._app.use(hpp());
		this._app.use(helmet());
		this._app.use(i18n.init);

		const limiter = rateLimit({
			windowMs: 10 * 60 * 1000,
			max: 100,
			standardHeaders: true,
			legacyHeaders: false,
		});
		this._app.use(limiter);
	}

	private configureRoutes(): void {
		// API routes
		this._app.use("/api", routes);

		// Static paths
		this._app.use(
			"/api/files",
			express.static(path.join(__dirname, "../uploads"))
		);

		// Error handler middleware
		if (process.env.NODE_ENV === "development") {
			this._app.use(errorHandler);
		}
	}

	private setupErrorHandling(): void {
		this._app.use(errorHandler);
	}

	private async initializeDatabase(): Promise<void> {
		try {
			await this._db.initialize();

			console.log("Data Source has been initialized!");

			const sessionRepository = this._db.getRepository(Session);

			// Session middleware
			this._app.use(
				session({
					secret: SECRET,
					resave: false,
					saveUninitialized: true,
					cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
					store: new (TypeormStore as any)({
						cleanupLimit: 2,
						limitSubquery: false, // Set to true if your database type requires subqueries
						ttl: 86400,
					}).connect(sessionRepository),
				})
			);
		} catch (err) {
			console.error("Error during Data Source initialization:", err);
		}
	}

	private initializeHttpServer(): void {
		this._httpServer = this._app.listen(this._httpServerPort, () => {
			console.log(`⚡️[server]: Server is running at ${this._httpServerPort}`);
		});
	}

	private initializeWebSocketServer(): void {
		if (!this._httpServer) throw new Error("HTTP server not initialized");

		this._webSocketServer = new WebSocketServer();
		this._webSocketServer.init();
	}

	private handleExceptions(): void {
		process.on("uncaughtException", error => {
			console.log("Server::uncaughtException::", error);
			process.exit(1); // Exit application
		});

		process.on("unhandledRejection", (error, promise) => {
			console.log("Server::unhandledRejection::promise", promise);
			console.log("Server::unhandledRejection::error", error);
			process.exit(1); // Exit application
		});

		process.on("SIGTERM", error => {
			this._webSocketServer?.close(() => {
				console.log("Server::SIGTERM", error);
				process.exit(0); // Exit application
			});

			this._httpServer?.close(() => {
				console.log("Server::SIGTERM", error);
				process.exit(0); // Exit application
			});

			this._db.destroy().then(() => {
				console.log("Server::SIGTERM", error);
				process.exit(0); // Exit application
			});
		});

		process.on("SIGINT", error => {
			this._webSocketServer?.close(() => {
				console.log("Server::SIGINT", error);
				process.exit(0); // Exit application
			});

			this._httpServer?.close(() => {
				console.log("Server::SIGINT", error);
				process.exit(0); // Exit application
			});

			this._db.destroy().then(() => {
				console.log("Server::SIGINT", error);
				process.exit(0); // Exit application
			});
		});
	}

	public async init(): Promise<void> {
		await this.initializeDatabase();

		this.initializeHttpServer();
		this.initializeWebSocketServer();
	}
}

export default APP;

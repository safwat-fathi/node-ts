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
import logger from "@/lib/utils/logger";

dotenv.config();

const SECRET = <string>process.env.SECRET || "";

class APP {
  private _app: Express;
  private _db: DataSource;
  private _webSocketServer: WebSocketServer | null = null;
  private _httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;
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
    this._app.use(express.json({ limit: "5mb" }));
    this._app.use(express.urlencoded({ extended: true, limit: "5mb" }));
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
      message: i18n.__("too-many-requests"),
      // statusCode: 429,
      // eslint-disable-next-line
      store: new (TypeormStore as any)({
        cleanupLimit: 2,
        limitSubquery: false, // Set to true if your database type requires subqueries
        ttl: 86400, // 24 hours
      }),
    });
    this._app.use(limiter);
  }

  private configureRoutes(): void {
    // API routes
    this._app.use("/api", routes);

    // Static paths
    this._app.use("/api/files", express.static(path.join(__dirname, "../uploads")));
  }

  private setupErrorHandling(): void {
    if (process.env.NODE_ENV === "development") this._app.use(errorHandler);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await this._db.initialize();

      logger.info("Data Source has been initialized!");

      const sessionRepository = this._db.getRepository(Session);

      // Session middleware
      this._app.use(
        session({
          secret: SECRET,
          resave: false,
          saveUninitialized: true,
          cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
          // eslint-disable-next-line
          store: new (TypeormStore as any)({
            cleanupLimit: 2,
            limitSubquery: false, // Set to true if your database type requires subqueries
            ttl: 86400,
          }).connect(sessionRepository),
        })
      );
    } catch (err) {
      logger.error("Error during Data Source initialization:", err);
    }
  }

  private initializeHttpServer(): void {
    this._httpServer = this._app.listen(this._httpServerPort, () => {
      logger.info(`⚡️[server]: Server is running at ${this._httpServerPort}`);
    });
  }

  private initializeWebSocketServer(): void {
    if (!this._httpServer) throw new Error("HTTP server not initialized");

    this._webSocketServer = WebSocketServer.getInstance();
    this._webSocketServer.init();
  }

  private async shutdown(exitCode: number): Promise<void> {
    if (this._httpServer) {
      if (this._webSocketServer) {
        this._webSocketServer.close();
      }

      this._httpServer.close(async () => {
        await this.closeDatabaseConnection();

        logger.info("HTTP server closed");
        process.exit(exitCode);
      });

      setTimeout(() => {
        logger.error("Forcing shutdown due to timeout.");
        process.exit(exitCode);
      });
    } else {
      logger.error("HTTP server not initialized");
      process.exit(1); // 1 for 'failure' status
    }
  }

  private closeDatabaseConnection = async () => {
    try {
      await this._db.destroy();
      logger.info("Database connection closed.");
    } catch (err) {
      logger.error(err, "Error while closing database connection.");
    }
  };

  private handleExceptions(): void {
    process.on("uncaughtException", async (error) => {
      logger.fatal(error, "Uncaught Exception! Shutting down...");
      await this.shutdown(1);
    });

    process.on("unhandledRejection", async (error, promise) => {
      logger.fatal({ error, promise }, "Unhandled Rejection! Shutting down...");
      await this.shutdown(1);
    });

    process.on("SIGTERM", async () => {
      logger.info("Received SIGTERM. Gracefully shutting down...");
      await this.shutdown(0); // 0 for 'success' status
    });

    process.on("SIGINT", async () => {
      logger.info("Received SIGINT (Ctrl+C). Gracefully shutting down...");
      await this.shutdown(0);
    });
  }

  public async init(): Promise<void> {
    await this.initializeDatabase();

    this.initializeHttpServer();
    this.initializeWebSocketServer();
  }
}

export default APP;

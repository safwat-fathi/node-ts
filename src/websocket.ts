/*
	TODO: add to WebSocketServer class
	- implement rooms
	- implement peer to peer connections
	- implement encryption
	- implement authentication
	- implement authorization
	- implement error handling
	- implement graceful shutdown

 */
import dotenv from "dotenv";
import { RawData, WebSocket, Server as WSS } from "ws";
import { IncomingMessage } from "http";
import logger from "@/lib/utils/logger";

dotenv.config();

type WebSocketClient = WebSocket & { id: string };
type WebSocketClients = Set<WebSocketClient>;
interface IMessage {
  from: WebSocketClient["id"] | "server";
  to: WebSocketClient["id"] | "public";
  payload: string;
}

export default class WebSocketServer {
  private static _instance: WebSocketServer | null = null;
  private readonly _wss: WSS;
  private _clients: WebSocketClients;

  private constructor() {
    this._wss = new WebSocket.Server({ port: process.env.WS_SERVER_PORT });
    this._clients = new Set();
  }

  public init() {
    this._attachEventListeners();
  }

  public static getInstance(): WebSocketServer {
    if (!WebSocketServer._instance) {
      WebSocketServer._instance = new WebSocketServer();
    }

    return WebSocketServer._instance;
  }

  public close(cb?: (err?: Error) => void) {
    this._wss.close();
    this._clients.clear();

    cb?.();
  }

  send(message: IMessage, socket: WebSocketClient) {
    const { to, payload } = message;

    this._clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN && to === client.id) {
        client.send(JSON.stringify(payload));
      }
    });
  }

  // {to: "public" | "socket.id", payload: "THIS IS A MESSAGE!"}
  broadcast(payload: Buffer | string, socket: WebSocketClient) {
    this._clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  private _attachEventListeners(): void {
    try {
      this._wss.on("connection", (socket: WebSocketClient, req: IncomingMessage) => {
        // set unique id for new client
        socket.id = <string>req.headers["sec-websocket-key"];

        this._clients.add(socket);

        logger.info(`Client with ID:${socket.id} opened a new websocket connection`);

        socket.send(JSON.stringify({ from: "server", payload: { myId: socket.id } }));

        socket.on("error", (err) => {
          logger.error("Websocket server error:", err);
          this._clients.clear();
          this._wss.close(() => process.exit(1));
        });

        socket.on("message", (data: RawData) => {
          const parsedData: { to: string; payload: string } = JSON.parse(data.toString("utf-8"));

          if (parsedData.to === "public") {
            this.broadcast(JSON.stringify(parsedData.payload), socket);
          } else {
            const message: IMessage = {
              from: socket.id,
              to: parsedData.to,
              payload: JSON.stringify(parsedData.payload),
            };

            this.send(message, socket);
          }
        });

        // When the socket connection is closed
        socket.on("close", () => {
          logger.info(`Client with ID:${socket.id} closed the websocket connection`);
          // delete client
          this._clients.delete(socket);
        });
      });
    } catch (err) {
      this._wss.close();
      this._clients.clear();
    }

    this._wss.on("close", () => {
      logger.warn("Websocket Server closed");
      this._clients.clear();
    });

    this._wss.on("open", () => {
      logger.info("Websocket Server opened");
    });

    this._wss.on("error", (err: Error) => {
      logger.error("Websocket server error:", err);
      this._clients.clear();
      this._wss.close(() => process.exit(1));
    });
  }
}

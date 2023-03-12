import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";
import { asyncHandler } from "src/api/middlewares/async.middleware";
import { Notification } from "src/server";
// import { Stream } from "stream";

// send to specific clients
// get from DB
// const clients: { id: string; response: Response }[] = [];

export const send = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // message body, sendTo user id
    const { message, sendTo } = req.body;

    Notification.emit("new", { message, sendTo });

    res.status(200).json({ success: true });
  }
);

export const receive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const headers: IncomingHttpHeaders = {
      "content-type": "text/event-stream",
      connection: "keep-alive",
      "cache-control": "no-cache",
      "content-encoding": "utf8",
      "Access-Control-Allow-Origin": "*",
    };
    // write headers and response with success
    res.writeHead(200, headers);

    Notification.on("new", data => {
      const { message, sendTo } = data;

      res.write(`data: ${JSON.stringify({ message, sendTo })}\n\n`);
    });

    // response end if connection closed
    req.on("close", () => res.end());
  }
);

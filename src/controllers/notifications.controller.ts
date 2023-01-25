import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";
import { asyncHandler } from "middlewares/async.middleware";
import { Notification } from "server";
import { Stream } from "stream";

// send to specific clients
// get from DB
let clients: { id: string; response: Response }[] = [];

export const send = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // message body, sendTo user id
    const { message, sendTo } = req.body;
    console.log("request body: ", { message, sendTo });

    Notification.emit("new", { message, sendTo });

    res.status(200).json({ success: true });
  }
);

export const receive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("connected");

    const headers: IncomingHttpHeaders = {
      "content-type": "text/event-stream",
      connection: "keep-alive",
      "cache-control": "no-cache",
      "content-encoding": "utf8",
      "Access-Control-Allow-Origin": "*",
    };
    res.writeHead(200, headers);
    // res.setHeader("Content-Type", "text/event-stream");
    // res.setHeader("Cache-Control", "no-cache");
    // res.setHeader("Connection", "keep-alive");

    // only if you want anyone to access this endpoint
    // res.setHeader("Access-Control-Allow-Origin", "*");

    // res.flushHeaders();
    // setInterval(() => {
    //   res.write("wdawdawd");
    // }, 1000);
    Notification.on("new", data => {
      console.log("new event: ", data);

      // res.write(JSON.stringify({ data }));
      res.write("ddddddddddddddd");
    });
    // next();
    req.on("close", () => {
      console.log("closed");

      res.end();
    });
  }
);

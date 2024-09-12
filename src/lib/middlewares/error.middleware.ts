import { NextFunction, Request, Response } from "express";
import HttpError from "@/lib/classes/errors/http";
import { HttpStatusCode } from "@/types/http";
import logger from "../utils/logger";

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
export const errorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const errResponse = {
    success: false,
    message: err?.message || res.__("server-error"),
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    errors: err?.errors,
  } as HttpError;

  if (!err.isOperational) logger.fatal(err, "Non-Operational error");
  else logger.error(err, "Operational error");

  if (err instanceof HttpError) {
    return res.status(err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      ...errResponse,
    });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: res.__("server-error"),
  });
};

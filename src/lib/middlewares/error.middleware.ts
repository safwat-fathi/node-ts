import { HttpError } from "@/lib/classes/errors/http";
import { NextFunction, Request, Response } from "express";

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let castError = null;

  // handle bad ObjectId mongoose requests
  if (err.stack?.includes("CastError")) {
    castError = new HttpError(404, res.__("not-found"));
  }

  res.status(err.status || 500).json({
    success: false,
    error: castError
      ? castError.message
      : err.errors
      ? err.errors
      : err.message || res.__("server-error"),
  });
};

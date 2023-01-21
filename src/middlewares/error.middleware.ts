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
  err: TypeError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("from error middleware", err.stack);

  res.status(500).json({
    success: false,
    error: err.message,
  });
};

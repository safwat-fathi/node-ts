import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { sendEmail } from "@lib/utils/auth";
import { HttpError } from "@lib/classes/errors/http";
import { asyncHandler } from "@api/middlewares/async.middleware";
import { TokenService } from "@/services/token.service";
import { Token } from "@/types/db";

dotenv.config();

const {
  NODE_ENV,
  CLIENT_HOST_DEV,
  CLIENT_PORT_DEV,
  CLIENT_HOST_PROD,
  CLIENT_PORT_PROD,
} = (process.env as {
  NODE_ENV: "development" | "production";
  CLIENT_HOST_DEV: string;
  CLIENT_PORT_DEV: number;
  CLIENT_HOST_PROD: string;
  CLIENT_PORT_PROD: number;
}) || {
  NODE_ENV: "development",
  CLIENT_HOST_DEV: "",
  CLIENT_HOST_PROD: "",
  CLIENT_PORT_DEV: 3000,
  CLIENT_PORT_PROD: 3000,
};

const CLIENT_HOST =
  NODE_ENV === "development"
    ? `${CLIENT_HOST_DEV}:${CLIENT_PORT_DEV}`
    : `${CLIENT_HOST_PROD}:${CLIENT_PORT_PROD}`;

const tokenService = new TokenService();

export const getToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params as Partial<Token>;

    if (!userId) {
      return next(new HttpError(400, "User id is missing"));
    }

    const token = await tokenService.read(userId);

    if (!token) {
      return next(new HttpError(404, "No token found for this user"));
    }

    res.status(200).json({ success: true, data: token });
  }
);

export const createToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, userId } = req.body as Token;

    if (!userId) {
      return next(new HttpError(400, "User id is missing"));
    }

    const newToken = await tokenService.add({ token, userId });

    if (!newToken) {
      return next(new HttpError(400, "Token already created for this user"));
    }

    res
      .status(200)
      .json({ success: true, message: "Token generated successfully" });
  }
);

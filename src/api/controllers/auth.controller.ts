import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken, sendEmail } from "@lib/utils/auth";
import { validationResult } from "express-validator";
import { HttpError } from "@lib/classes/errors/http";
import { asyncHandler } from "@api/middlewares/async.middleware";
import { UserService } from "@services/users.service";
import { User } from "@/types/db";

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

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, password } = req.body;
    const userService = new UserService();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMapped = errors
        .array()
        .map(err => ({ param: err.param, message: err.msg }));

      return next(new HttpError(400, "Signup failed", errorsMapped));
    }

    const user = await userService.create({
      name,
      email,
      phone,
      password,
    });

    res.status(201).json({ success: true, data: user });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (req.session.userToken) {
      return next(
        new HttpError(
          401,
          "Already logged in, Please request a password reset if you suspect this is not you."
        )
      );
    }

    const userService = new UserService();

    const user = await userService.login({ email, password });

    if (!user) {
      return next(new HttpError(422, "Please enter valid email or password"));
    }

    const token = await generateAccessToken(user.id, user.name);

    req.session.userToken = token;

    res.status(200).json({
      success: true,
      data: {
        accessToken: token,
        user,
      },
    });
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as User;

    const userService = new UserService();

    const resetToken = await userService.forgotPassword(email);

    if (!resetToken) {
      return next(new HttpError(422, "This email is not registered"));
    }

    // TODO: should be handled by FE
    // link to reset password page
    const resetUrl = `${CLIENT_HOST}/auth/forgot-password/${resetToken}`;

    // message template
    const message = `Please follow this reset password URL ${resetUrl} to change your password`;

    // send email with the message
    await sendEmail({ email, message, subject: "Reset password request" });
    // console.log(" sendEmail success");

    // TODO: if not success delete resetPasswordToken & resetPasswordExpire fields from DB
    res.status(200).json({
      success: true,
      data: "Email sent successfully",
    });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userToken) {
      req.session.userToken = "";

      req.session.destroy(err => {
        if (err) next(new HttpError(404, err));
      });

      res.status(200).json({ success: true });
    } else {
      return next(new HttpError(404, "Not logged in"));
    }
  }
);

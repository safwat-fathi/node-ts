import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken, sendEmail } from "@/lib/utils/auth";
import { validationResult } from "express-validator";
import { HttpError } from "@/lib/classes/errors/http";
import { asyncHandler } from "@/api/middlewares/async.middleware";
import { AuthService } from "@/services/auth.service";
import { Token, User } from "@/types/db";

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

const authService = new AuthService();

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMapped = errors
        .array()
        .map(err => ({ param: err.param, message: err.msg }));

      return next(new HttpError(400, "Signup failed", errorsMapped));
    }

    await authService.signup({
      name,
      email,
      phone,
      password,
    });

    res
      .status(201)
      .json({ success: true, message: "Signup completed successfully" });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMapped = errors
        .array()
        .map(err => ({ param: err.param, message: err.msg }));

      return next(new HttpError(400, "Login failed", errorsMapped));
    }

    if (req.session.userToken) {
      return next(
        new HttpError(
          400,
          "Already logged in, Please request a password reset if you suspect this is not you or logout to use another account."
        )
      );
    }

    const user = await authService.login({ email, password });

    if (!user) {
      return next(new HttpError(422, "Please enter valid email or password"));
    }

    // token expires in 24 hrs
    const token = await generateAccessToken(user.id, user.name);

    req.session.userToken = token;

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
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

    const resetToken = await authService.forgotPassword(email);

    if (!resetToken) {
      return next(new HttpError(422, "This email is not registered"));
    }

    // link to reset password page
    const resetUrl = new URL("/profile/change-password/", CLIENT_HOST);

    resetUrl.searchParams.set("resetToken", resetToken);
    // const resetUrl = `${CLIENT_HOST}/profile/change-password/${resetToken}`;

    // TODO: message template should be HTML
    // message template
    const message = `<h1>Please reset your password from <a href="${resetUrl}">here</a></h1>`;

    // send email with the message
    await sendEmail({ email, message, subject: "Reset password request" });

    // TODO: if not success delete resetPasswordToken & resetPasswordExpire fields from DB
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userToken) {
      req.session.userToken = "";

      req.session.destroy(err => {
        if (err) next(new HttpError(500, err));
      });

      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } else {
      return next(new HttpError(400, "Not logged in"));
    }
  }
);

export const verification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params as Partial<Token>;

    if (!token) {
      return next(new HttpError(400, "Token is missing"));
    }

    const verified = await authService.verifyEmail(token);

    if (!verified) {
      return next(new HttpError(404, "No user found or user already verified"));
    }

    res.status(200).json({ success: true, message: "User verified" });
  }
);

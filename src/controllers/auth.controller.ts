import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "utils/auth";
import { UserStore } from "models/user/user.model";
import { validationResult } from "express-validator";
import { HttpError } from "errors/http";
import { asyncHandler } from "middlewares/async.middleware";

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, password } = req.body;
    const userStore = new UserStore();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMapped = errors
        .array()
        .map(err => ({ param: err.param, message: err.msg }));

      return next(new HttpError(400, "Signup failed", errorsMapped));
    }

    const user = await userStore.signup({
      name,
      email,
      phone,
      password,
      orders: [],
    });

    res.status(201).json({ success: true, data: user });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log("req.session", req.session);
    console.log("req.sessionID", req.sessionID);
    console.log("req.session.userId", req.session.userId);

    if (req.session.userId) {
      return next(
        new HttpError(
          401,
          "Already logged in, Please request a password reset if you suspect this is not you."
        )
      );
    }

    const userStore = new UserStore();

    const user = await userStore.login({ email, password });

    if (!user) {
      return next(new HttpError(422, "Please enter valid email or password"));
    }

    const token = generateAccessToken(user.id, user.name);

    req.session.userId = user.id;

    res.status(200).json({
      success: true,
      data: {
        accessToken: token,
        user,
      },
    });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
      req.session.userId = null;

      req.session.destroy(err => {
        next(new HttpError(404, err));
      });

      res.status(200).json({ success: true });
    } else {
      return next(new HttpError(404, "Not logged in"));
    }
  }
);

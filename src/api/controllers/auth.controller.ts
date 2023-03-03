import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "lib/utils/auth";
import { validationResult } from "express-validator";
import { HttpError } from "lib/classes/errors/http";
import { asyncHandler } from "api/middlewares/async.middleware";
import { UserService } from "services/users.service";

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

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";

import catchAsync from "../utils/catchAsync";

const auth = (...requiredRole: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // CHECK TOKEN IS GIVEN OR NOT
    if (!token) {
      throw new AppError(401, "You are not authorized");
    }

    // VERIFY TOKEN
    let decode;
    try {
      decode = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    } catch (error) {
      throw new AppError(401, "Unauthorized");
    }
    const { role, email, iat } = decode;

    // CHECK USER EXIST OR NOT

    //req.user = decode;
    next();
  });
};

export default auth;

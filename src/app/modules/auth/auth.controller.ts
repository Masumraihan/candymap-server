import { Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { CustomRequest, TTokenUser } from "../../types/common";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const userRegister = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User register successfully",
    data: result,
  });
});

const userLogin = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "none",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User login successfully",
    data: {
      accessToken,
    },
  });
});
const changedPassword = catchAsync(async (req, res: Response) => {
  const user = (req as CustomRequest).user.data as TTokenUser;
  const { ...passwordData } = req.body;
  await AuthServices.changedPassword(user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully",
    data: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieve successfully",
    data: result,
  });
});

export const AuthControllers = {
  userRegister,
  userLogin,
  changedPassword,
  refreshToken,
};

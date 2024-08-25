import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";
import { CustomRequest, TTokenUser } from "../../types/common";

const createParent = catchAsync(async (req, res) => {
  const user = (req as CustomRequest).user as TTokenUser;
  const result = await UserServices.createParentIntoDB(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const user = (req as CustomRequest).user as TTokenUser;
  const result = await UserServices.getProfileFromDb(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const user = (req as CustomRequest).user as TTokenUser;
  const result = await UserServices.updateProfileIntoDb(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserController = {
  createParent,
  getProfile,
  updateProfile,
};

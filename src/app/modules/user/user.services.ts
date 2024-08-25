/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";

import { TUser } from "./user.interface";
import UserModel from "./user.model";
import { TTokenUser } from "../../types/common";

const createParentIntoDB = async (user: TUser) => {};

const getProfileFromDb = async (user: TTokenUser) => {
  const profile = await UserModel.findOne({ email: user.email, role: user.role });
  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return profile;
};

const updateProfileIntoDb = async (user: TTokenUser, payload: Partial<TUser>) => {
  console.log({ user, payload });
  //const userData = await UserModel.findOne({ email: user.email, role: user.role });

  //if (!userData) {
  //  throw new AppError(httpStatus.NOT_FOUND, "User not found");
  //}

  //const profile = await UserModel.findOneAndUpdate(
  //  { email: user.email, role: user.role },
  //  payload,
  //  {
  //    new: true,
  //    runValidators: true,
  //  },
  //);
  //if (!profile) {
  //  throw new AppError(httpStatus.NOT_FOUND, "User not found");
  //}
  //return profile;
};

export const UserServices = {
  createParentIntoDB,
  getProfileFromDb,
  updateProfileIntoDb,
};

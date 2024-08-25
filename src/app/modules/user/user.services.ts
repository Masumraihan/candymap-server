import bcrypt from "bcrypt";
import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { v4 as uuid } from "uuid";
import { TTokenUser } from "../../types/common";
import { TLocation } from "../location/location.interface";
import LocationModel from "../location/location.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import config from "../../config";
import { USER_ROLE } from "./user.constant";
import path from "path";
import fs from "fs";
import { sendMail } from "../../utils/sendMail";

const createParentIntoDB = async (
  user: TTokenUser,
  payload: { name: string; email: string; password?: string },
) => {
  const userData = await UserModel.findOne({ email: user.email, role: user.role });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const password = payload.password || `${uuid().slice(0, 6)}`;

  const parentData = await UserModel.create({
    ...payload,
    role: USER_ROLE.parent,
    creator: user._id,
    password,
  });

  const parentMailTemplate = path.join(process.cwd(), "/src/template/email.html");
  const appLink = config.appLink as string;

  const parentMailHtml = fs.readFileSync(parentMailTemplate, "utf-8");
  const parentMailHtmlWithLink = parentMailHtml
    .replace(/{{name}}/g, parentData.name)
    .replace(/{{appLink}}/g, appLink)
    .replace(/{{email}}/g, parentData.email)
    .replace(/{{password}}/g, password);

  await sendMail({
    html: parentMailHtmlWithLink,
    to: parentData.email,
  });

  return parentData;
};

const getProfileFromDb = async (user: TTokenUser) => {
  const profile = await UserModel.findOne({ email: user.email, role: user.role });
  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return profile;
};

const updateProfileIntoDb = async (
  user: TTokenUser,
  { location, ...payload }: Partial<TUser> & { location?: Partial<TLocation> },
) => {
  const userData = await UserModel.findOne({ email: user.email, role: user.role });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update location
    let userLocationData = await LocationModel.findOne({ user: userData._id });
    if (userLocationData && location) {
      userLocationData = await LocationModel.findOneAndUpdate({ user: userData._id }, location, {
        new: true,
        runValidators: true,
        session,
      });
    }

    // update profile
    const profile = await UserModel.findOneAndUpdate(
      { email: user.email, role: user.role },
      payload,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    await session.commitTransaction();
    await session.endSession();
    return {
      profile,
      location: userLocationData,
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);
    throw new AppError(httpStatus.BAD_REQUEST, "error occurred when updating profile");
  }
};

export const UserServices = {
  createParentIntoDB,
  getProfileFromDb,
  updateProfileIntoDb,
};

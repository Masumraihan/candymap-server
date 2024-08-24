/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";

import { TUser } from "./user.interface";
import UserModel from "./user.model";

const createParentIntoDB = async (user: TUser) => {
  console.log(user);
};

export const UserServices = {
  createParentIntoDB,
};

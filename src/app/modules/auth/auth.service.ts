import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";
import { TLoginUser, TRegister } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";

const registerUser = async (payload: TRegister) => {
  const user = await UserModel.create(payload);
  return user;
};

const loginUser = async (payload: TLoginUser) => {
  // find user exists or not
  const user = await UserModel.findOne({
    email: payload.email,
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Incorrect email");
  }

  // check password
  if (!(await UserModel.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Incorrect password");
  }

  const accessToken = createToken(
    { email: user.email, role: user.role },
    config.jwt_access_secret as string,
    config.access_token_expire_in as string,
  );
  const refreshToken = createToken(
    { email: user.email, role: user.role },
    config.jwt_refresh_secret as string,
    config.refresh_token_expire_in as string,
  );

  return { accessToken, refreshToken };
};

// UPDATE PASSWORD
const changedPassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // find user exists or not
  const user = await UserModel.findOne({ email: userData.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Incorrect email");
  }
  // check password
  if (!(await UserModel.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Incorrect password");
  }

  // hashed password before updating database
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await UserModel.findOneAndUpdate(
    { email: user.email, role: user.role },
    { password: newHashedPassword },
  );

  return result;
};

const refreshToken = async (token: string) => {
  // CHECK TOKEN IS GIVEN OR NOT
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  // VERIFY TOKEN
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { role, email } = decoded;

  const user = await UserModel.findOne({
    email: email,
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `This ${role} not found`);
  }

  const accessToken = createToken(
    { email: user.email, role: user.role },
    config.jwt_access_secret as string,
    config.access_token_expire_in as string,
  );
  return { accessToken };
};

export const AuthServices = {
  registerUser,
  loginUser,
  changedPassword,
  refreshToken,
};

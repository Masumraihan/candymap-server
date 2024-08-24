import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  creator?: string;
};

export interface UserStaticModel extends Model<TUser> {
  isPasswordMatched(plainTextPassword: string, hastPassword: string): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;


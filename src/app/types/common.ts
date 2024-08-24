import { Request } from "express";
import { TUserRole } from "../modules/user/user.interface";
import { JwtPayload } from "jsonwebtoken";

export type TTokenUser = JwtPayload & { email: string; role: TUserRole };
export interface CustomRequest extends Request {
  user: TTokenUser;
}

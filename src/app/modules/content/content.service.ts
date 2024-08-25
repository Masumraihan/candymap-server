import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import ContentModel from "./content.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { TContent } from "./content.interface";

const createContentIntoDb = async (user: TTokenUser, payload: TContent) => {
  const userData = await UserModel.findOne({ email: user.email, role: user.role });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  payload.type = payload.type.replace(/ /g, "_").toLowerCase();

  const locationPayload = {
    ...payload,
    creator: userData._id,
  };
  const result = await ContentModel.create(locationPayload);
  return result;
};

const getContentFromDb = async (query: Record<string, unknown>) => {
  const locationQueryBuilder = new QueryBuilder(ContentModel.find(), query).filter().fields();
  const result = await locationQueryBuilder.modelQuery.populate("creator");

  return result;
};

export const ContentServices = {
  createContentIntoDb,
  getContentFromDb,
};

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import { TLocation } from "./location.interface";
import LocationModel from "./location.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createLocationIntoDb = async (user: TTokenUser, payload: TLocation) => {
  const userData = await UserModel.findOne({ email: user.email, role: user.role });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const locationPayload = {
    ...payload,
    user: userData._id,
  };
  const result = await LocationModel.create(locationPayload);
  return result;
};

const getLocationFromDb = async (query: Record<string, unknown>) => {
  const locationQueryBuilder = new QueryBuilder(LocationModel.find(), query)
    .search(["address", "state"])
    .filter()
    .sort()
    .fields();
  const result = await locationQueryBuilder.modelQuery.populate("user");
  const meta = await locationQueryBuilder.countTotal();

  return {
    data: result,
    meta,
  };
};

export const LocationServices = {
  createLocationIntoDb,
  getLocationFromDb,
};

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LocationServices } from "./location.service";
import { CustomRequest, TTokenUser } from "../../types/common";
import pick from "../../utils/pick";

const createLocation = catchAsync(async (req, res) => {
  const user = (req as CustomRequest).user as TTokenUser;
  const result = await LocationServices.createLocationIntoDb(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Location created successfully",
    data: result,
  });
});

const getLocation = catchAsync(async (req, res) => {
  const query = pick(req.query, ["state", "searchTerm", "page", "limit", "fields", "sort"]);
  const { data, meta } = await LocationServices.getLocationFromDb(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location fetched successfully",
    meta,
    data,
  });
});

export const LocationControllers = {
  createLocation,
  getLocation,
};

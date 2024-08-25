import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LocationServices } from "./location.service";

const createLocation = catchAsync(async (req, res) => {
  const result = await LocationServices.createLocationIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Location created successfully",
    data: result,
  });
});

const getLocation = catchAsync(async (req, res) => {
  const result = await LocationServices.getLocationFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location fetched successfully",
    data: result,
  });
});

export const LocationControllers = {
  createLocation,
  getLocation,
};

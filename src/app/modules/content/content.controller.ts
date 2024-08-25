import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContentServices } from "./content.service";
import { CustomRequest, TTokenUser } from "../../types/common";
import pick from "../../utils/pick";

const createContent = catchAsync(async (req, res) => {
  const user = (req as CustomRequest).user as TTokenUser;
  const result = await ContentServices.createContentIntoDb(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Content created successfully",
    data: result,
  });
});

const getContent = catchAsync(async (req, res) => {
  const query = pick(req.query, ["state", "searchTerm", "page", "limit", "fields", "sort"]);
  const result = await ContentServices.getContentFromDb(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Content fetched successfully",
    data: result,
  });
});

export const ContentControllers = {
  createContent,
  getContent,
};

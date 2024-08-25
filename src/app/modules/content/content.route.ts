import { Router } from "express";
import { ContentControllers } from "./content.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { ContentValidations } from "./content.validation";

const router = Router();

router.get("/get-contents", ContentControllers.getContent);
router.post(
  "/add-content",
  auth(USER_ROLE.admin),
  validateRequest(ContentValidations.createContentValidationSchema),
  ContentControllers.createContent,
);

export const ContentRoutes = router;

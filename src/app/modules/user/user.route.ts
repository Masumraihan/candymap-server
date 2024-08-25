import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { userValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.get(
  "/profile",
  auth(USER_ROLE.admin, USER_ROLE.candyGiver, USER_ROLE.parent),
  UserController.getProfile,
);
router.post(
  "/create-parent",
  validateRequest(userValidations.createParentValidationSchema),
  UserController.createParent,
);

router.patch(
  "/update-profile",
  auth(USER_ROLE.admin, USER_ROLE.candyGiver, USER_ROLE.parent),
  validateRequest(userValidations.updateProfileValidationSchema),
  UserController.updateProfile,
);

export const UserRoutes = router;

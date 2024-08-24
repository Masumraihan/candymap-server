import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { userValidations } from "./user.validation";

const router = express.Router();

router.post(
  "/create-parent",
  validateRequest(userValidations.createParentValidationSchema),
  UserController.createParent,
);

export const UserRoutes = router;

import express from "express";
import { AuthControllers } from "./auth.controller";
import { AuthValidations } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidations.registerValidationSchema),
  AuthControllers.userRegister,
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.userLogin,
);
router.post(
  "/change-password",
  auth(USER_ROLE.admin, USER_ROLE.candyGiver, USER_ROLE.parent),
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changedPassword,
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;

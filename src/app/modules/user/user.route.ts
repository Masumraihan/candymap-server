import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { studentValidations } from "../students/student.validation";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "../faculty/faculty.validation";
import { AdminValidations } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { userValidations } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserController.createStudent,
);
router.post(
  "/create-faculty",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  "/create-admin",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.superAdmin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);
router.post(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty, USER_ROLE.student),
  UserController.getMe,
);
router.post(
  "/change-status/:id",
  validateRequest(userValidations.changeStatusValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserController.changeStatus,
);

export const UserRoutes = router;

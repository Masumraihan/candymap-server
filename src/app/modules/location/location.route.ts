import { Router } from "express";
import { LocationControllers } from "./location.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.get("/", LocationControllers.getLocation);
router.post("/", auth(USER_ROLE.candyGiver), LocationControllers.createLocation);

export const LocationRoutes = router;

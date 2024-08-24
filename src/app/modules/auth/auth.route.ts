import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  res.send("login");
});

export const AuthRoutes = router;

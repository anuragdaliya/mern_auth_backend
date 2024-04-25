import express from "express";
import {
  profile,
  signin,
  signout,
  signup,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/profile", verifyToken, profile);

export default router;

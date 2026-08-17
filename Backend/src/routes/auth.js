import express from "express";
import { register, login, getProfile, verifyEmail } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);

export default router;

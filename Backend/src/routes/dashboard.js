import express from "express";
import { getDashboardStats, getActivityFeed } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/stats", getDashboardStats);
router.get("/activity", getActivityFeed);

export default router;

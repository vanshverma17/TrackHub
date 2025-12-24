import express from "express";
import * as ctrl from "../controllers/timeEntriesController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/", ctrl.createTimeEntry);
router.get("/", ctrl.getTimeEntries);
router.get("/stats", ctrl.getTimeStats);
router.put("/:id", ctrl.updateTimeEntry);
router.delete("/:id", ctrl.deleteTimeEntry);

export default router;

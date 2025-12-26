import express from "express";
import { authenticate } from "../middleware/auth.js";
import * as ctrl from "../controllers/timetableController.js";

const router = express.Router();

router.use(authenticate);

router.get("/", ctrl.getTimetableRows);
router.post("/", ctrl.createTimetableRow);
router.put("/:id", ctrl.updateTimetableRow);
router.delete("/:id", ctrl.deleteTimetableRow);

export default router;

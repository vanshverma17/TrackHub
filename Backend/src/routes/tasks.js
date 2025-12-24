import express from "express";
import * as ctrl from "../controllers/tasksController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/", ctrl.createTask);
router.get("/", ctrl.getTasks);
router.get("/:id", ctrl.getTask);
router.put("/:id", ctrl.updateTask);
router.patch("/:id/move", ctrl.moveTask);
router.delete("/:id", ctrl.deleteTask);

export default router;

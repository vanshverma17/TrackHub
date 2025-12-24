import express from "express";
import * as ctrl from "../controllers/projectsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/", ctrl.createProject);
router.get("/", ctrl.getProjects);
router.get("/:id", ctrl.getProject);
router.put("/:id", ctrl.updateProject);
router.delete("/:id", ctrl.deleteProject);

export default router;

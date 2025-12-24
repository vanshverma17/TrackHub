import express from "express";
import * as ctrl from "../controllers/todosController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/", ctrl.createTodo);
router.get("/", ctrl.getTodos);
router.put("/:id", ctrl.updateTodo);
router.patch("/:id/toggle", ctrl.toggleComplete);
router.delete("/:id", ctrl.deleteTodo);

export default router;

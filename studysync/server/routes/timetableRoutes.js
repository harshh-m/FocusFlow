import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getTasks, addTask, deleteTask, toggleTask } from "../controllers/timetableController.js";

const router = Router();

// Protect ALL routes
router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", addTask);
router.delete("/:id", deleteTask);
router.put("/:id/toggle", toggleTask);

export default router;

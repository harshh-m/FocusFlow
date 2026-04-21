import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getFocusData, finishFocusSession } from "../controllers/focusController.js";

const router = Router();

// Fully secure endpoints
router.use(authMiddleware);

router.get("/", getFocusData);
router.post("/finish", finishFocusSession);

export default router;
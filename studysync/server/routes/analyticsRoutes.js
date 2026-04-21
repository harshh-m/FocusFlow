import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = Router();

router.get("/", authMiddleware, getAnalytics);

export default router;
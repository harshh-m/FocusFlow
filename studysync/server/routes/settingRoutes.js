import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSettings, updateSettings } from "../controllers/settingController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getSettings);
router.put("/", updateSettings);

export default router;
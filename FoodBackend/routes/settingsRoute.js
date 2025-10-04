import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getUserSettings,
  updateProfile,
  changePassword,
  updateNotifications,
  updatePaymentPreferences,
  updateTheme,
  getRewardsInfo
} from "../controllers/settingsController.js";

const router = express.Router();

// All routes protected by authMiddleware
router.use(authMiddleware);

router.get("/", getUserSettings);
router.put("/profile", updateProfile);
router.put("/password", changePassword);
router.put("/notifications", updateNotifications);
router.put("/payment", updatePaymentPreferences);
router.put("/theme", updateTheme);
router.get("/rewards", getRewardsInfo);

export default router;
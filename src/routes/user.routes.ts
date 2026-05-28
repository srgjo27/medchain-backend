import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Protected user profile routes
router.get("/profile", authenticate, userController.getProfile);
router.patch("/profile", authenticate, userController.updateProfile);
router.post("/profile/avatar", authenticate, upload.single("avatar"), userController.uploadAvatar);
router.delete("/profile/avatar", authenticate, userController.deleteAvatar);
router.delete("/me", authenticate, userController.deleteAccount);

export default router;

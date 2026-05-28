import type { Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";
import { updateProfileSchema } from "../models/profile.schema.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const userController = {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Autentikasi diperlukan.",
        });
        return;
      }
      const profile = await userService.getProfile(userId);
      res.status(200).json({
        status: "success",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Autentikasi diperlukan.",
        });
        return;
      }
      const parsedData = updateProfileSchema.parse(req.body);
      const updatedProfile = await userService.updateProfile(userId, parsedData);
      res.status(200).json({
        status: "success",
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadAvatar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Autentikasi diperlukan.",
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          status: "error",
          message: "Tidak ada file avatar yang diunggah.",
        });
        return;
      }

      const result = await userService.updateAvatar(
        userId,
        req.file.buffer,
        req.file.originalname
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteAvatar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Autentikasi diperlukan.",
        });
        return;
      }

      await userService.deleteAvatar(userId);

      res.status(200).json({
        status: "success",
        data: { message: "Foto profil berhasil dihapus." },
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteAccount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Autentikasi diperlukan.",
        });
        return;
      }

      await userService.deleteAccount(userId);

      res.status(200).json({
        status: "success",
        data: { message: "Akun dan seluruh data terkait berhasil dihapus secara permanen." },
      });
    } catch (error) {
      next(error);
    }
  },
};

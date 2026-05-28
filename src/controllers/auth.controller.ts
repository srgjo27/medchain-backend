import type { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../models/user.schema.js";
import { authService } from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedData = registerSchema.parse(req.body);
      const result = await authService.register(parsedData);
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedData = loginSchema.parse(req.body);
      const result = await authService.login(parsedData.email, parsedData.password);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        if (token) {
          await authService.logout(token);
        }
      }
      res.status(200).json({
        status: "success",
        data: { message: "Logout berhasil" },
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = String(req.params["token"]);
      if (!token) {
        res.status(400).json({
          status: "error",
          message: "Token verifikasi diperlukan",
        });
        return;
      }
      const result = await authService.verifyEmail(token);
      res.status(200).json({
        status: "success",
        data: {
          message: "Email berhasil diverifikasi",
          ...result,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedData = forgotPasswordSchema.parse(req.body);
      const result = await authService.forgotPassword(parsedData.email);
      res.status(200).json({
        status: "success",
        data: {
          message: "Link reset password telah dikirim ke email",
          ...result,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedData = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(parsedData.token, parsedData.newPassword);
      res.status(200).json({
        status: "success",
        data: { message: "Password berhasil diperbarui" },
      });
    } catch (error) {
      next(error);
    }
  },
};

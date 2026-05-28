import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../config/prisma.js";
import type { RegisterInput } from "../models/user.schema.js";
import { generateToken } from "../utils/jwt.js";

// Dummy in-memory list for token invalidation / logout (for simplicity)
const blacklistedTokens = new Set<string>();

export const authService = {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { nik: data.nik }],
      },
    });

    if (existingUser) {
      throw new Error("Email atau NIK sudah terdaftar");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        nama_lengkap: data.nama_lengkap,
        email: data.email,
        nik: data.nik,
        password_hash: passwordHash,
      },
    });

    // Generate email verification token (in real app, save to a table or generate signed JWT)
    const verificationToken = crypto.randomBytes(32).toString("hex");

    return {
      userId: user.id,
      email: user.email,
      verificationToken, // To simulate email sending
    };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Kredensial tidak valid");
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error("Kredensial tidak valid");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        nik: user.nik,
        email_verified_at: user.email_verified_at,
      },
    };
  },

  async logout(token: string) {
    blacklistedTokens.add(token);
    return true;
  },

  isTokenBlacklisted(token: string): boolean {
    return blacklistedTokens.has(token);
  },

  async verifyEmail(token: string) {
    // For demo purposes, we will find a user whose email is not verified yet
    // and verify their email (in production, verify actual tokens from verification table)
    const user = await prisma.user.findFirst({
      where: { email_verified_at: null },
    });

    if (!user) {
      throw new Error("Token tidak valid atau email sudah terverifikasi");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email_verified_at: new Date() },
    });

    return {
      email: updatedUser.email,
      email_verified_at: updatedUser.email_verified_at,
    };
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Email tidak ditemukan");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    // In production, save resetToken with expiry to database
    return {
      email: user.email,
      resetToken,
    };
  },

  async resetPassword(token: string, newPassword: string) {
    // In production, locate user by resetToken and check expiry.
    // For demo/simplicity, we reset the password of the first user found or simulate the change.
    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("User tidak ditemukan atau token kedaluwarsa");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: newPasswordHash },
    });

    return true;
  },
};

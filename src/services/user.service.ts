import { prisma } from "../config/prisma.js";
import { storageService } from "./storage.service.js";
import type { UpdateProfileInput } from "../models/profile.schema.js";
import type { GolonganDarah } from "../generated/prisma/index.js";

export const userService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nama_lengkap: true,
        email: true,
        nik: true,
        foto_url: true,
        tanggal_lahir: true,
        golongan_darah: true,
        alergi: true,
        no_hp: true,
        email_verified_at: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new Error("Pengguna tidak ditemukan");
    }

    return user;
  },

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const updateData: any = {};

    if (data.nama_lengkap !== undefined) updateData.nama_lengkap = data.nama_lengkap;
    if (data.no_hp !== undefined) updateData.no_hp = data.no_hp;
    if (data.alergi !== undefined) updateData.alergi = data.alergi;
    
    if (data.tanggal_lahir !== undefined) {
      updateData.tanggal_lahir = data.tanggal_lahir ? new Date(data.tanggal_lahir) : null;
    }

    if (data.golongan_darah !== undefined) {
      updateData.golongan_darah = data.golongan_darah ? (data.golongan_darah.replace("-", "_MINUS").replace("+", "_PLUS") as GolonganDarah) : null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        nama_lengkap: true,
        email: true,
        nik: true,
        foto_url: true,
        tanggal_lahir: true,
        golongan_darah: true,
        alergi: true,
        no_hp: true,
        email_verified_at: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
  },

  async updateAvatar(userId: string, fileBuffer: Buffer, originalName: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { foto_url: true },
    });

    if (!user) {
      throw new Error("Pengguna tidak ditemukan");
    }

    // Delete old avatar if exists
    if (user.foto_url) {
      await storageService.deleteFile(user.foto_url, "avatars");
    }

    const publicUrl = await storageService.uploadFile(fileBuffer, originalName, "avatars");

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { foto_url: publicUrl },
      select: {
        id: true,
        foto_url: true,
      },
    });

    return updatedUser;
  },

  async deleteAvatar(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { foto_url: true },
    });

    if (!user || !user.foto_url) {
      throw new Error("Pengguna tidak memiliki foto profil");
    }

    await storageService.deleteFile(user.foto_url, "avatars");

    await prisma.user.update({
      where: { id: userId },
      data: { foto_url: null },
    });

    return true;
  },

  async deleteAccount(userId: string) {
    // 1. Soft delete all medical records (set is_deleted = true) and delete their files from storage
    const records = await prisma.medicalRecord.findMany({
      where: { user_id: userId, is_deleted: false },
      select: { id: true, file_url: true },
    });

    for (const record of records) {
      await storageService.deleteFile(record.file_url, "medchain-files");
      await prisma.medicalRecord.update({
        where: { id: record.id },
        data: { is_deleted: true },
      });
    }

    // 2. Revoke active access grants (set is_revoked = true)
    await prisma.accessGrant.updateMany({
      where: { owner_id: userId, is_revoked: false },
      data: { is_revoked: true },
    });

    // 3. Delete avatar from storage if exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { foto_url: true },
    });
    if (user?.foto_url) {
      await storageService.deleteFile(user.foto_url, "avatars");
    }

    // 4. Delete user account permanently
    await prisma.user.delete({
      where: { id: userId },
    });

    // 5. Send confirmation email (stub/log simulation)
    console.log(`Sending deletion confirmation email to user ${userId}`);

    return true;
  },
};

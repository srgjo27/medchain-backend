/*
  Warnings:

  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GolonganDarah" AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "alergi" TEXT[],
ADD COLUMN     "foto_url" TEXT,
ADD COLUMN     "golongan_darah" "GolonganDarah",
ADD COLUMN     "no_hp" VARCHAR(20),
ADD COLUMN     "tanggal_lahir" DATE,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

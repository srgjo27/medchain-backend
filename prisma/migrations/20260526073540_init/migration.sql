-- CreateEnum
CREATE TYPE "KategoriMedis" AS ENUM ('lab', 'radiologi', 'resep', 'rujukan', 'vaksin', 'lainnya');

-- CreateEnum
CREATE TYPE "BlockchainActionType" AS ENUM ('store', 'revoke');

-- CreateEnum
CREATE TYPE "BlockchainStatus" AS ENUM ('pending', 'confirmed', 'failed');

-- CreateEnum
CREATE TYPE "AccessLogAction" AS ENUM ('view', 'download', 'verify');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "nik" CHAR(16) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email_verified_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_records" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "judul" VARCHAR(200) NOT NULL,
    "kategori" "KategoriMedis" NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_hash" CHAR(64) NOT NULL,
    "tanggal_dokumen" DATE NOT NULL,
    "catatan" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "uploaded_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockchain_records" (
    "id" UUID NOT NULL,
    "medical_record_id" UUID NOT NULL,
    "tx_hash" VARCHAR(100) NOT NULL,
    "action_type" "BlockchainActionType" NOT NULL,
    "network" VARCHAR(30) NOT NULL,
    "block_number" BIGINT,
    "status" "BlockchainStatus" NOT NULL,
    "gas_used" INTEGER,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP,

    CONSTRAINT "blockchain_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_grants" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "record_ids" UUID[],
    "token" VARCHAR(64) NOT NULL,
    "berlaku_hingga" TIMESTAMP NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "allow_download" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_logs" (
    "id" UUID NOT NULL,
    "grant_id" UUID NOT NULL,
    "ip_address" VARCHAR(45) NOT NULL,
    "user_agent" TEXT NOT NULL,
    "action" "AccessLogAction" NOT NULL,
    "accessed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "users"("nik");

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockchain_records" ADD CONSTRAINT "blockchain_records_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_grants" ADD CONSTRAINT "access_grants_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_logs" ADD CONSTRAINT "access_logs_grant_id_fkey" FOREIGN KEY ("grant_id") REFERENCES "access_grants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

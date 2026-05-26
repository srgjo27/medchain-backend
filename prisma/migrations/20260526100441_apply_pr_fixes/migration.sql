/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `access_grants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "access_grants_token_key" ON "access_grants"("token");

-- CreateIndex
CREATE INDEX "access_grants_owner_id_idx" ON "access_grants"("owner_id");

-- CreateIndex
CREATE INDEX "access_logs_grant_id_idx" ON "access_logs"("grant_id");

-- CreateIndex
CREATE INDEX "blockchain_records_medical_record_id_idx" ON "blockchain_records"("medical_record_id");

-- CreateIndex
CREATE INDEX "medical_records_user_id_idx" ON "medical_records"("user_id");

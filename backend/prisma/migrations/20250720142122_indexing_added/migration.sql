-- DropIndex
DROP INDEX "Otp_email_idx";

-- CreateIndex
CREATE INDEX "Household_id_idx" ON "Household"("id");

-- CreateIndex
CREATE INDEX "Otp_email_userId_idx" ON "Otp"("email", "userId");

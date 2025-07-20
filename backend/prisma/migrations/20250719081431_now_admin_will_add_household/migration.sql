/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `Household` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Household` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Household" DROP COLUMN "photoUrl",
DROP COLUMN "verified";

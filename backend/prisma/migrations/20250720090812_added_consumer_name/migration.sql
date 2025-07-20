/*
  Warnings:

  - Added the required column `consumerName` to the `Household` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Household" ADD COLUMN     "consumerName" TEXT NOT NULL;

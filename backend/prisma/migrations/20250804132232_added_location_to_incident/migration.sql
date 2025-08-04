/*
  Warnings:

  - Added the required column `location` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "location" TEXT NOT NULL;

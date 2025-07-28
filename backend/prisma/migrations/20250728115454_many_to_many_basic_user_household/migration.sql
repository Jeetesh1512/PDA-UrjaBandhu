/*
  Warnings:

  - You are about to drop the column `householdId` on the `BasicUser` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BasicUser_id_householdId_key";

-- AlterTable
ALTER TABLE "BasicUser" DROP COLUMN "householdId";

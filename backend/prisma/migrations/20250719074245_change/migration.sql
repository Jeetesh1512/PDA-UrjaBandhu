/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `BasicUser` table. All the data in the column will be lost.
  - Added the required column `photoUrl` to the `Household` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BasicUser" DROP COLUMN "photoUrl";

-- AlterTable
ALTER TABLE "Household" ADD COLUMN     "photoUrl" TEXT NOT NULL;

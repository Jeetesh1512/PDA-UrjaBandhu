-- DropForeignKey
ALTER TABLE "BasicUser" DROP CONSTRAINT "BasicUser_householdId_fkey";

-- CreateTable
CREATE TABLE "_UserToHousehold" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserToHousehold_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserToHousehold_B_index" ON "_UserToHousehold"("B");

-- AddForeignKey
ALTER TABLE "_UserToHousehold" ADD CONSTRAINT "_UserToHousehold_A_fkey" FOREIGN KEY ("A") REFERENCES "BasicUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToHousehold" ADD CONSTRAINT "_UserToHousehold_B_fkey" FOREIGN KEY ("B") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

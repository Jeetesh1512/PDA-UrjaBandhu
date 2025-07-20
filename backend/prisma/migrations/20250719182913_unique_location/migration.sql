/*
  Warnings:

  - A unique constraint covering the columns `[location]` on the table `Locality` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Locality_location_key" ON "Locality"("location");

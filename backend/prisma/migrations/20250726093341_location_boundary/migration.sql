/*
  Warnings:

  - Added the required column `boundary` to the `Locality` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable

CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE "Locality" ADD COLUMN "boundary" geometry(POLYGON,4326) NOT NULL;

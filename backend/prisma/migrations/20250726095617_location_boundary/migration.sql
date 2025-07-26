-- This is an empty migration.CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE "Locality" ADD COLUMN "boundary" geometry(POLYGON, 4326);
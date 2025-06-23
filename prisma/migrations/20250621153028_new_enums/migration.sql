/*
  Warnings:

  - The values [FALL_DETECTED,IMMOBILITY_DETECTED,ROUTE_DEVIATION,DANGER_ZONE_ENTRY,MANUAL_EMERGENCY] on the enum `AlertType` will be removed. If these variants are still used in the database, this will fail.
  - The values [LOW,MEDIUM,HIGH] on the enum `Severity` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AlertType_new" AS ENUM ('SEVERE_WEATHER_WARNING', 'FLOOD_WARNING', 'TORNADO_WARNING', 'HURRICANE_WARNING', 'EARTHQUAKE_ALERT', 'TSUNAMI_WARNING', 'WILDFIRE_ALERT', 'CIVIL_EMERGENCY', 'AMBER_ALERT', 'SILVER_ALERT', 'TERRORISM_ALERT', 'HAZMAT_INCIDENT', 'INFRASTRUCTURE_FAILURE', 'PUBLIC_HEALTH_EMERGENCY', 'EVACUATION_ORDER', 'SHELTER_IN_PLACE', 'ROAD_CLOSURE', 'POWER_OUTAGE', 'WATER_EMERGENCY');
ALTER TABLE "alerts" ALTER COLUMN "type" TYPE "AlertType_new" USING ("type"::text::"AlertType_new");
ALTER TYPE "AlertType" RENAME TO "AlertType_old";
ALTER TYPE "AlertType_new" RENAME TO "AlertType";
DROP TYPE "AlertType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Severity_new" AS ENUM ('INFO', 'ADVISORY', 'WATCH', 'WARNING', 'EMERGENCY', 'CRITICAL');
ALTER TABLE "alerts" ALTER COLUMN "severity" TYPE "Severity_new" USING ("severity"::text::"Severity_new");
ALTER TYPE "Severity" RENAME TO "Severity_old";
ALTER TYPE "Severity_new" RENAME TO "Severity";
DROP TYPE "Severity_old";
COMMIT;

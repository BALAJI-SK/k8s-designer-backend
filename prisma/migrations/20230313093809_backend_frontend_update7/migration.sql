/*
  Warnings:

  - You are about to drop the column `backendServiceId` on the `project_service_configs` table. All the data in the column will be lost.
  - Changed the type of `service_type` on the `project_service_configs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "project_service_configs" DROP CONSTRAINT "project_service_configs_backendServiceId_fkey";

-- DropForeignKey
ALTER TABLE "project_service_configs" DROP CONSTRAINT "project_service_configs_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_service_configs" DROP CONSTRAINT "project_service_configs_service_id_fkey";

-- DropIndex
DROP INDEX "project_service_configs_project_id_key";

-- AlterTable
ALTER TABLE "project_service_configs" DROP COLUMN "backendServiceId",
DROP COLUMN "service_type",
ADD COLUMN     "service_type" TEXT NOT NULL;

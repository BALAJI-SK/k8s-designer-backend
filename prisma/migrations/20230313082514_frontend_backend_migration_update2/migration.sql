/*
  Warnings:

  - You are about to drop the column `backendServiceId` on the `env_variables` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "env_variables" DROP CONSTRAINT "env_variables_backendServiceId_fkey";

-- AlterTable
ALTER TABLE "env_variables" DROP COLUMN "backendServiceId",
ADD COLUMN     "backendServicesId" UUID;

-- AddForeignKey
ALTER TABLE "env_variables" ADD CONSTRAINT "env_variables_backendServicesId_fkey" FOREIGN KEY ("backendServicesId") REFERENCES "backend_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

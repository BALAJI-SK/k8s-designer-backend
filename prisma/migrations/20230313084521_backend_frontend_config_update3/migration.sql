/*
  Warnings:

  - You are about to drop the column `backendServicesId` on the `env_variables` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "env_variables" DROP CONSTRAINT "env_variables_backendServicesId_fkey";

-- AlterTable
ALTER TABLE "env_variables" DROP COLUMN "backendServicesId",
ADD COLUMN     "backend_services_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AddForeignKey
ALTER TABLE "env_variables" ADD CONSTRAINT "env_variables_backend_services_id_fkey" FOREIGN KEY ("backend_services_id") REFERENCES "backend_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

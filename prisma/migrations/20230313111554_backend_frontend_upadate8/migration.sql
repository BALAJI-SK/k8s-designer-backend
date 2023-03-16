/*
  Warnings:

  - You are about to drop the column `service_id` on the `project_service_configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "backend_services" ADD COLUMN     "service_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "frontend_services" ADD COLUMN     "service_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "project_service_configs" DROP COLUMN "service_id";

-- AddForeignKey
ALTER TABLE "project_service_configs" ADD CONSTRAINT "project_service_configs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frontend_services" ADD CONSTRAINT "frontend_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backend_services" ADD CONSTRAINT "backend_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "env_variables" ADD CONSTRAINT "env_variables_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

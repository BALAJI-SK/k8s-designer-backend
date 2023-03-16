-- AlterTable
ALTER TABLE "env_variables" ADD COLUMN     "backendServiceId" UUID;

-- AlterTable
ALTER TABLE "project_service_configs" ADD COLUMN     "backendServiceId" UUID;

-- CreateTable
CREATE TABLE "backend_services" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "react_version" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "number_of_replicas" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "backend_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_service_configs" ADD CONSTRAINT "project_service_configs_backendServiceId_fkey" FOREIGN KEY ("backendServiceId") REFERENCES "backend_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "env_variables" ADD CONSTRAINT "env_variables_backendServiceId_fkey" FOREIGN KEY ("backendServiceId") REFERENCES "backend_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "backend_services" DROP CONSTRAINT "backend_services_service_id_fkey";

-- DropForeignKey
ALTER TABLE "database_services" DROP CONSTRAINT "database_services_service_id_fkey";

-- DropForeignKey
ALTER TABLE "env_variables" DROP CONSTRAINT "env_variables_service_id_fkey";

-- DropForeignKey
ALTER TABLE "frontend_services" DROP CONSTRAINT "frontend_services_service_id_fkey";

-- DropForeignKey
ALTER TABLE "image_repositories" DROP CONSTRAINT "image_repositories_service_id_fkey";

-- DropForeignKey
ALTER TABLE "project_service_configs" DROP CONSTRAINT "project_service_configs_project_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_fkey";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_service_configs" ADD CONSTRAINT "project_service_configs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frontend_services" ADD CONSTRAINT "frontend_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backend_services" ADD CONSTRAINT "backend_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "database_services" ADD CONSTRAINT "database_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "env_variables" ADD CONSTRAINT "env_variables_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_repositories" ADD CONSTRAINT "image_repositories_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "database_services" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "port" TEXT NOT NULL,
    "number_of_replicas" INTEGER NOT NULL,
    "default_user" TEXT NOT NULL,
    "default_user_password" TEXT NOT NULL,
    "root_user_password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schema_name" TEXT NOT NULL DEFAULT 'public',
    "service_id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "database_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "database_services" ADD CONSTRAINT "database_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

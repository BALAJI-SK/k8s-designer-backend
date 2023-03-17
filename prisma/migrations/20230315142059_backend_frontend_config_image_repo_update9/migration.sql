-- CreateTable
CREATE TABLE "image_repositories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image_repository_url" TEXT NOT NULL,
    "image_repository_token" TEXT NOT NULL,
    "service_id" UUID NOT NULL,

    CONSTRAINT "image_repositories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "image_repositories" ADD CONSTRAINT "image_repositories_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "project_service_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

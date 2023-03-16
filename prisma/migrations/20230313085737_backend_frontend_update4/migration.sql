/*
  Warnings:

  - You are about to drop the column `backend_services_id` on the `env_variables` table. All the data in the column will be lost.
  - You are about to drop the column `frontend_services_id` on the `env_variables` table. All the data in the column will be lost.
  - Added the required column `service_id` to the `env_variables` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "env_variables" DROP CONSTRAINT "env_variables_backend_services_id_fkey";

-- DropForeignKey
ALTER TABLE "env_variables" DROP CONSTRAINT "env_variables_frontend_services_id_fkey";

-- AlterTable
ALTER TABLE "env_variables" DROP COLUMN "backend_services_id",
DROP COLUMN "frontend_services_id",
ADD COLUMN     "service_id" UUID NOT NULL;

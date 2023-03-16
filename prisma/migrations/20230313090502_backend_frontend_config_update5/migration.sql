/*
  Warnings:

  - You are about to drop the column `service_id` on the `env_variables` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `env_variables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "env_variables" DROP COLUMN "service_id",
ADD COLUMN     "serviceId" UUID NOT NULL;

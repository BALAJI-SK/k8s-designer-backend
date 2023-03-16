/*
  Warnings:

  - You are about to drop the column `serviceId` on the `env_variables` table. All the data in the column will be lost.
  - Added the required column `service_id` to the `env_variables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "env_variables" DROP COLUMN "serviceId",
ADD COLUMN     "service_id" UUID NOT NULL;

/*
  Warnings:

  - You are about to drop the column `name` on the `database_services` table. All the data in the column will be lost.
  - Added the required column `database_name` to the `database_services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "database_services" DROP COLUMN "name",
ADD COLUMN     "database_name" TEXT NOT NULL;

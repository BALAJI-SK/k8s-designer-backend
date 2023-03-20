/*
  Warnings:

  - You are about to drop the column `default_user` on the `database_services` table. All the data in the column will be lost.
  - You are about to drop the column `default_user_password` on the `database_services` table. All the data in the column will be lost.
  - You are about to drop the column `root_user_password` on the `database_services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "database_services" DROP COLUMN "default_user",
DROP COLUMN "default_user_password",
DROP COLUMN "root_user_password",
ADD COLUMN     "db_password" TEXT NOT NULL DEFAULT gen_random_bytes(64),
ADD COLUMN     "db_user" TEXT NOT NULL DEFAULT 'postgres';

-- AlterTable
ALTER TABLE "image_repositories" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'admin@localhost',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'admin';

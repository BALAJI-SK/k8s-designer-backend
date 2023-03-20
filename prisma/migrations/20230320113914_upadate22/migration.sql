-- AlterTable
ALTER TABLE "database_services" ALTER COLUMN "db_password" DROP DEFAULT,
ALTER COLUMN "db_user" DROP DEFAULT;

-- AlterTable
ALTER TABLE "image_repositories" ALTER COLUMN "email" DROP DEFAULT,
ALTER COLUMN "username" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT;

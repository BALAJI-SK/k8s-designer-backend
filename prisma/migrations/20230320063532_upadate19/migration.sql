-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" SET DEFAULT gen_random_bytes(64);

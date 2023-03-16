/*
  Warnings:

  - You are about to drop the column `react_version` on the `backend_services` table. All the data in the column will be lost.
  - You are about to drop the column `react_version` on the `frontend_services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "backend_services" DROP COLUMN "react_version";

-- AlterTable
ALTER TABLE "frontend_services" DROP COLUMN "react_version";

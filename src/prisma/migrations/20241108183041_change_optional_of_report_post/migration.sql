/*
  Warnings:

  - Made the column `status` on table `ReportPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ReportPost" ALTER COLUMN "status" SET NOT NULL;

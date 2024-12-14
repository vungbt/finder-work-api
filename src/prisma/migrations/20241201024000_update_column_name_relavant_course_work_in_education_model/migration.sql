/*
  Warnings:

  - You are about to drop the column `relevantCourseworks` on the `Education` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "relevantCourseworks",
ADD COLUMN     "relevantCourseWorks" TEXT[];

/*
  Warnings:

  - You are about to drop the column `jobTitleId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_jobTitleId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "jobTitleId",
ADD COLUMN     "jobCategoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_jobCategoryId_fkey" FOREIGN KEY ("jobCategoryId") REFERENCES "JobCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

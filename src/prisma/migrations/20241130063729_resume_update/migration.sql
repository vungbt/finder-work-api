/*
  Warnings:

  - You are about to drop the column `fileId` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the `ResumeTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_fileId_fkey";

-- DropForeignKey
ALTER TABLE "ResumeTemplate" DROP CONSTRAINT "ResumeTemplate_fileId_fkey";

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "fileId",
ADD COLUMN     "avatarId" TEXT,
ADD COLUMN     "pdfId" TEXT,
ADD COLUMN     "thumbnailId" TEXT;

-- DropTable
DROP TABLE "ResumeTemplate";

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

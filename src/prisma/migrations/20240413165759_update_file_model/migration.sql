-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_resumeTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_jobTitleId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "jobTitleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ResumeTemplate" ADD COLUMN     "fileId" TEXT;

-- AddForeignKey
ALTER TABLE "ResumeTemplate" ADD CONSTRAINT "ResumeTemplate_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_jobTitleId_fkey";

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "type" SET DEFAULT 'full_time',
ALTER COLUMN "level" SET DEFAULT 'entry',
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "jobTitleId" DROP NOT NULL,
ALTER COLUMN "companyId" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

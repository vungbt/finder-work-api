-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('published', 'scheduling', 'expired', 'draft');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "coverLetterRequired" BOOLEAN DEFAULT false,
ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "maxSalary" INTEGER,
ADD COLUMN     "minSalary" INTEGER,
ADD COLUMN     "status" "JobStatus" DEFAULT 'draft';

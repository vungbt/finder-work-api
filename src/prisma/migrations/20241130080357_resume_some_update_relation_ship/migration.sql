/*
  Warnings:

  - You are about to drop the column `major` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `resumeId` on the `LanguageSkill` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `resumeId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the `_CertificateToFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LanguageSkill" DROP CONSTRAINT "LanguageSkill_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "_CertificateToFile" DROP CONSTRAINT "_CertificateToFile_A_fkey";

-- DropForeignKey
ALTER TABLE "_CertificateToFile" DROP CONSTRAINT "_CertificateToFile_B_fkey";

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "fileId" TEXT,
ADD COLUMN     "resumeId" TEXT;

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "major",
ADD COLUMN     "skillId" TEXT;

-- AlterTable
ALTER TABLE "LanguageSkill" DROP COLUMN "resumeId";

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "languageId";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "resumeId";

-- DropTable
DROP TABLE "_CertificateToFile";

-- CreateTable
CREATE TABLE "_ResumeToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LanguageSkillToResume" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ResumeToSkill_AB_unique" ON "_ResumeToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_ResumeToSkill_B_index" ON "_ResumeToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageSkillToResume_AB_unique" ON "_LanguageSkillToResume"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageSkillToResume_B_index" ON "_LanguageSkillToResume"("B");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResumeToSkill" ADD CONSTRAINT "_ResumeToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResumeToSkill" ADD CONSTRAINT "_ResumeToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageSkillToResume" ADD CONSTRAINT "_LanguageSkillToResume_A_fkey" FOREIGN KEY ("A") REFERENCES "LanguageSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageSkillToResume" ADD CONSTRAINT "_LanguageSkillToResume_B_fkey" FOREIGN KEY ("B") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

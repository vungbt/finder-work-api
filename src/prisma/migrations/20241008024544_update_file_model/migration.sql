/*
  Warnings:

  - You are about to drop the column `certificateId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `resumeTemplateId` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_certificateId_fkey";

-- DropIndex
DROP INDEX "File_resumeTemplateId_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "certificateId",
DROP COLUMN "resumeTemplateId";

-- CreateTable
CREATE TABLE "_CertificateToFile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToFile_AB_unique" ON "_CertificateToFile"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToFile_B_index" ON "_CertificateToFile"("B");

-- AddForeignKey
ALTER TABLE "_CertificateToFile" ADD CONSTRAINT "_CertificateToFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToFile" ADD CONSTRAINT "_CertificateToFile_B_fkey" FOREIGN KEY ("B") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

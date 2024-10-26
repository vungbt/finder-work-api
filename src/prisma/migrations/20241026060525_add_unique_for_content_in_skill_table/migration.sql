/*
  Warnings:

  - A unique constraint covering the columns `[content]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Skill_content_key" ON "Skill"("content");

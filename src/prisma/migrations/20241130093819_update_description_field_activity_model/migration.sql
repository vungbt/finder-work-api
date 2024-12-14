/*
  Warnings:

  - You are about to drop the column `descriotion` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `description` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "descriotion",
ADD COLUMN     "description" TEXT NOT NULL;

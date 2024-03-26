/*
  Warnings:

  - You are about to drop the column `tokenVerifyCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tokenVerifyCode",
ADD COLUMN     "verifyCode" TEXT;

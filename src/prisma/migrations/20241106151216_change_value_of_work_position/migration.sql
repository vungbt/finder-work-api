/*
  Warnings:

  - The values [head_of_epartment] on the enum `WorkPosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkPosition_new" AS ENUM ('staff', 'team_leader', 'vice_of_department', 'head_of_department', 'vice_director', 'director', 'general_director');
ALTER TABLE "User" ALTER COLUMN "workingPosition" TYPE "WorkPosition_new" USING ("workingPosition"::text::"WorkPosition_new");
ALTER TYPE "WorkPosition" RENAME TO "WorkPosition_old";
ALTER TYPE "WorkPosition_new" RENAME TO "WorkPosition";
DROP TYPE "WorkPosition_old";
COMMIT;

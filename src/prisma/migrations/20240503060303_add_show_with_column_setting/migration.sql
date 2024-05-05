-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "showWith" "UserRole"[] DEFAULT ARRAY['super_admin']::"UserRole"[];

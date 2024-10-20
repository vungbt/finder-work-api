-- CreateTable
CREATE TABLE "ReportPost" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "message" TEXT,
    "userId" TEXT,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReportPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportPost" ADD CONSTRAINT "ReportPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportPost" ADD CONSTRAINT "ReportPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

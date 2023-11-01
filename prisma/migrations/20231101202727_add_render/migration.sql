-- CreateTable
CREATE TABLE "Render" (
    "id" TEXT NOT NULL,
    "snippetId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoUrl" TEXT,

    CONSTRAINT "Render_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Render" ADD CONSTRAINT "Render_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "Snippet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

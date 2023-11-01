/*
  Warnings:

  - Added the required column `userId` to the `Render` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Render" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Render" ADD CONSTRAINT "Render_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

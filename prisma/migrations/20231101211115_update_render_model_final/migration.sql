/*
  Warnings:

  - A unique constraint covering the columns `[bucketName,renderId]` on the table `Render` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `renderId` to the `Render` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Render" ADD COLUMN     "renderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Render_bucketName_renderId_key" ON "Render"("bucketName", "renderId");

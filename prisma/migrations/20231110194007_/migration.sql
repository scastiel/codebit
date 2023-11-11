/*
  Warnings:

  - A unique constraint covering the columns `[renderId]` on the table `Render` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Render_renderId_key" ON "Render"("renderId");

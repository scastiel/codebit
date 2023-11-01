/*
  Warnings:

  - Added the required column `done` to the `Render` table without a default value. This is not possible if the table is not empty.
  - Added the required column `error` to the `Render` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Render" ADD COLUMN     "done" BOOLEAN NOT NULL,
ADD COLUMN     "endedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "error" BOOLEAN NOT NULL;

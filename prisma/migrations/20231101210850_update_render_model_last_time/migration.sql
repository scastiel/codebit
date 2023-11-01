/*
  Warnings:

  - Added the required column `bucketName` to the `Render` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Render" ADD COLUMN     "bucketName" TEXT NOT NULL;

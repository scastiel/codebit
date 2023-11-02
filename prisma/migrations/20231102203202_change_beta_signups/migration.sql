/*
  Warnings:

  - The `signedUpAt` column on the `BetaSignups` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BetaSignups" DROP COLUMN "signedUpAt",
ADD COLUMN     "signedUpAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

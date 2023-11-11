/*
  Warnings:

  - Added the required column `interval` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Interval" AS ENUM ('MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "interval" "Interval" NOT NULL;

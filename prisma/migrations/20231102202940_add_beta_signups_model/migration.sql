-- CreateTable
CREATE TABLE "BetaSignups" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "signedUpAt" TEXT NOT NULL,

    CONSTRAINT "BetaSignups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BetaSignups_email_key" ON "BetaSignups"("email");

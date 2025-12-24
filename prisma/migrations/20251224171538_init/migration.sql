-- CreateEnum
CREATE TYPE "SambaTime" AS ENUM ('LESS_THAN_1_YEAR', 'FROM_1_TO_3_YEARS', 'MORE_THAN_3_YEARS');

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "artisticName" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "phoneWhatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT,
    "instagram" TEXT,
    "hasParticipatedBefore" BOOLEAN NOT NULL,
    "participatedDetails" TEXT,
    "sambaTime" "SambaTime" NOT NULL,
    "hasLiveBatteryExp" BOOLEAN NOT NULL,
    "availableNightsWeekend" BOOLEAN NOT NULL,
    "awarePresenceRequired" BOOLEAN NOT NULL,
    "photoFaceUrl" TEXT NOT NULL,
    "photoBodyUrl" TEXT NOT NULL,
    "isOver18" BOOLEAN NOT NULL,
    "availableAllRehearsals" BOOLEAN NOT NULL,
    "awareRepresentBlock" BOOLEAN NOT NULL,
    "acceptedRegulation" BOOLEAN NOT NULL,
    "authorizedImageUse" BOOLEAN NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Candidate_email_idx" ON "Candidate"("email");

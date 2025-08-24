/*
  Warnings:

  - You are about to drop the column `guestId` on the `Participation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Participation` table. All the data in the column will be lost.
  - You are about to drop the `Guest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Participation" DROP CONSTRAINT "Participation_guestId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Participation" DROP CONSTRAINT "Participation_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Participation" DROP COLUMN "guestId",
DROP COLUMN "userId",
ADD COLUMN     "participantId" TEXT;

-- DropTable
DROP TABLE "public"."Guest";

-- CreateTable
CREATE TABLE "public"."Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participation" ADD CONSTRAINT "Participation_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

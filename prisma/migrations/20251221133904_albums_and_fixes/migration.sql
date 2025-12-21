/*
  Warnings:

  - Added the required column `isLocal` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isVerdictOk` to the `ContestSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "isLocal" BOOLEAN NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pdfLink" TEXT;

-- AlterTable
ALTER TABLE "ContestSubmission" ADD COLUMN     "isVerdictOk" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "bronzeMedals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goldMedals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "official" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "silverMedals" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TeamParticipation" (
    "id" SERIAL NOT NULL,
    "solvedTasks" INTEGER NOT NULL,
    "penalty" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "medalIndex" INTEGER NOT NULL DEFAULT 0,
    "teamId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,

    CONSTRAINT "TeamParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumPhoto" (
    "id" SERIAL NOT NULL,
    "albumId" INTEGER NOT NULL,
    "photoLink" TEXT NOT NULL,

    CONSTRAINT "AlbumPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamParticipation" ADD CONSTRAINT "TeamParticipation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamParticipation" ADD CONSTRAINT "TeamParticipation_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPhoto" ADD CONSTRAINT "AlbumPhoto_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

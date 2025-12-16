/*
  Warnings:

  - You are about to drop the column `taskIdentifiers` on the `Contest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "taskIdentifiers";

-- CreateTable
CREATE TABLE "ContestTask" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "contestId" INTEGER NOT NULL,

    CONSTRAINT "ContestTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestSubmission" (
    "id" SERIAL NOT NULL,
    "submissionTime" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,

    CONSTRAINT "ContestSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contestant" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "Contestant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContestToTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ContestToTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContestToTeam_B_index" ON "_ContestToTeam"("B");

-- AddForeignKey
ALTER TABLE "ContestTask" ADD CONSTRAINT "ContestTask_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestSubmission" ADD CONSTRAINT "ContestSubmission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestSubmission" ADD CONSTRAINT "ContestSubmission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contestant" ADD CONSTRAINT "Contestant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestToTeam" ADD CONSTRAINT "_ContestToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestToTeam" ADD CONSTRAINT "_ContestToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

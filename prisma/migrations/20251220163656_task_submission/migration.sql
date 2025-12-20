/*
  Warnings:

  - Added the required column `taskId` to the `ContestSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContestSubmission" ADD COLUMN     "taskId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ContestSubmission" ADD CONSTRAINT "ContestSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ContestTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

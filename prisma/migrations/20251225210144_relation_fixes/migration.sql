/*
  Warnings:

  - You are about to drop the column `official` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `_ContestToTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ContestToTeam" DROP CONSTRAINT "_ContestToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContestToTeam" DROP CONSTRAINT "_ContestToTeam_B_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "official";

-- AlterTable
ALTER TABLE "TeamParticipation" ADD COLUMN     "official" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "_ContestToTeam";

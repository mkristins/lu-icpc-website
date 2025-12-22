/*
  Warnings:

  - You are about to drop the column `bronzeMedals` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `goldMedals` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `silverMedals` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contestant" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "bronzeMedals",
DROP COLUMN "goldMedals",
DROP COLUMN "silverMedals";

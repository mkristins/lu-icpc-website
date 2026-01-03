/*
  Warnings:

  - You are about to drop the column `from` on the `Contest` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Contest` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Contest` table. All the data in the column will be lost.
  - Added the required column `date` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Contestant` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `date` to the `NewsArticle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "from",
DROP COLUMN "to",
DROP COLUMN "year",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Contestant" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "NewsArticle" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

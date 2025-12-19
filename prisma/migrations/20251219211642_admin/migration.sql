/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `AdminUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password_hash` to the `AdminUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "password_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

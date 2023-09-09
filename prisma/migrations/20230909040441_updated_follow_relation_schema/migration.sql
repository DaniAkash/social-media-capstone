/*
  Warnings:

  - You are about to drop the column `followerId` on the `Follow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[currentUserId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentUserId` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- DropIndex
DROP INDEX "Follow_followerId_key";

-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "followerId",
ADD COLUMN     "currentUserId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Follow_currentUserId_key" ON "Follow"("currentUserId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_currentUserId_fkey" FOREIGN KEY ("currentUserId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assigneeId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Task` table. All the data in the column will be lost.
  - The `id` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `creatorId` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamMembers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";

-- AlterTable
ALTER TABLE "Task" DROP CONSTRAINT "Task_pkey",
DROP COLUMN "assigneeId",
DROP COLUMN "createdAt",
DROP COLUMN "teamId",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "dueDate" DROP NOT NULL,
ALTER COLUMN "dueDate" SET DATA TYPE TEXT,
DROP COLUMN "creatorId",
ADD COLUMN     "creatorId" INTEGER,
ADD CONSTRAINT "Task_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "password",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "_TeamMembers";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

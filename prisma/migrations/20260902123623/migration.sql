/*
  Warnings:

  - You are about to drop the column `calorieGoal` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `goalTypeId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `goaltype` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `goalType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_goalTypeId_fkey`;

-- DropIndex
DROP INDEX `User_goalTypeId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `goal` DROP COLUMN `calorieGoal`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `goalTypeId`,
    ADD COLUMN `goalType` ENUM('WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE') NOT NULL;

-- DropTable
DROP TABLE `goaltype`;

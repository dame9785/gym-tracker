/*
  Warnings:

  - A unique constraint covering the columns `[activeKey]` on the table `WorkoutSession` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `workoutsession` ADD COLUMN `activeKey` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `WorkoutSession_activeKey_key` ON `WorkoutSession`(`activeKey`);

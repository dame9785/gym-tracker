/*
  Warnings:

  - You are about to drop the `goal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `goal` DROP FOREIGN KEY `Goal_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `goalTypeId` INTEGER NULL;

-- DropTable
DROP TABLE `goal`;

-- CreateTable
CREATE TABLE `GoalType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GoalType_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_goalTypeId_fkey` FOREIGN KEY (`goalTypeId`) REFERENCES `GoalType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

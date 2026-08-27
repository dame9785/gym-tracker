/*
  Warnings:

  - You are about to drop the column `createdAt` on the `calorielog` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `calorielog` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `calorielog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `calorielog` DROP FOREIGN KEY `CalorieLog_userId_fkey`;

-- DropIndex
DROP INDEX `CalorieLog_userId_date_idx` ON `calorielog`;

-- DropIndex
DROP INDEX `CalorieLog_userId_date_key` ON `calorielog`;

-- AlterTable
ALTER TABLE `calorielog` DROP COLUMN `createdAt`,
    DROP COLUMN `date`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `carbs` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `fat` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `loggedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `protein` INTEGER NOT NULL DEFAULT 0,
    MODIFY `calories` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `CalorieLog` ADD CONSTRAINT `CalorieLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

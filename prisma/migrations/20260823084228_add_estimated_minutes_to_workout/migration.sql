/*
  Warnings:

  - Made the column `birthDate` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bodyWeight` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `goalWeight` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `goalDate` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `birthDate` DATE NOT NULL,
    MODIFY `bodyWeight` DECIMAL(5, 2) NOT NULL,
    MODIFY `firstName` VARCHAR(50) NOT NULL,
    MODIFY `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    MODIFY `lastName` VARCHAR(50) NOT NULL,
    MODIFY `goalWeight` DECIMAL(5, 2) NOT NULL,
    MODIFY `phoneNumber` VARCHAR(20) NOT NULL,
    MODIFY `goalDate` DATE NOT NULL,
    MODIFY `height` DECIMAL(5, 2) NOT NULL;

-- AlterTable
ALTER TABLE `workout` ADD COLUMN `estimatedMinutes` INTEGER NULL;

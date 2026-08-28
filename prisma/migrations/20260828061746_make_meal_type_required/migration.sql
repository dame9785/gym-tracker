/*
  Warnings:

  - Made the column `mealType` on table `meal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `meal` MODIFY `mealType` ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK') NOT NULL;

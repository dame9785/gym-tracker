/*
  Warnings:

  - Made the column `slug` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `slug` VARCHAR(191) NOT NULL;

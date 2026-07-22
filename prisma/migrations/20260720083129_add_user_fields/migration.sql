/*
  Warnings:

  - You are about to drop the column `bodyLenght` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `bodyLenght`,
    ADD COLUMN `lenght` DECIMAL(5, 2) NULL;

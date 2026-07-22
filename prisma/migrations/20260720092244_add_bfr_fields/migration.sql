/*
  Warnings:

  - You are about to drop the column `lenght` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `lenght`,
    ADD COLUMN `bodyLenght` DECIMAL(65, 30) NULL;

/*
  Warnings:

  - You are about to drop the column `bodyLength` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `bodyLength`,
    ADD COLUMN `height` DECIMAL(5, 2) NULL;

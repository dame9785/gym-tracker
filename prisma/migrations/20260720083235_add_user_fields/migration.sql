/*
  Warnings:

  - You are about to alter the column `lenght` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `lenght` DECIMAL(65, 30) NULL;

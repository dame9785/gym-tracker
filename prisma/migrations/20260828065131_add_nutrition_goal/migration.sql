/*
  Warnings:

  - You are about to drop the column `calorieGoal` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `carbsGoal` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `fatGoal` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `proteinGoal` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `calorieGoal`,
    DROP COLUMN `carbsGoal`,
    DROP COLUMN `fatGoal`,
    DROP COLUMN `proteinGoal`;

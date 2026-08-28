-- AlterTable
ALTER TABLE `user` ADD COLUMN `calorieGoal` DECIMAL(8, 2) NULL,
    ADD COLUMN `carbsGoal` DECIMAL(6, 2) NULL,
    ADD COLUMN `fatGoal` DECIMAL(6, 2) NULL,
    ADD COLUMN `proteinGoal` DECIMAL(6, 2) NULL;

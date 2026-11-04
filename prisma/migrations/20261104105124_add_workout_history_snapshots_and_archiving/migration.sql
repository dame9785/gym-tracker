/*
  Warnings:

  - Added the required column `workoutName` to the `WorkoutSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exerciseDescription` to the `WorkoutSessionExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exerciseInstructions` to the `WorkoutSessionExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exerciseName` to the `WorkoutSessionExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryMuscle` to the `WorkoutSessionExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondaryMuscles` to the `WorkoutSessionExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `workout` ADD COLUMN `archivedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `workoutexercise` ADD COLUMN `archivedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `workoutsession` ADD COLUMN `workoutDescription` VARCHAR(500) NULL,
    ADD COLUMN `workoutName` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `workoutsessionexercise` ADD COLUMN `exerciseDescription` TEXT NOT NULL,
    ADD COLUMN `exerciseEquipment` VARCHAR(50) NULL,
    ADD COLUMN `exerciseImagePath` TEXT NULL,
    ADD COLUMN `exerciseInstructions` TEXT NOT NULL,
    ADD COLUMN `exerciseName` VARCHAR(191) NOT NULL,
    ADD COLUMN `exerciseTechniqueTips` TEXT NULL,
    ADD COLUMN `primaryMuscle` VARCHAR(191) NOT NULL,
    ADD COLUMN `secondaryMuscles` TEXT NOT NULL;

-- CreateIndex
CREATE INDEX `Workout_userId_archivedAt_idx` ON `Workout`(`userId`, `archivedAt`);

-- CreateIndex
CREATE INDEX `WorkoutExercise_workoutId_archivedAt_idx` ON `WorkoutExercise`(`workoutId`, `archivedAt`);

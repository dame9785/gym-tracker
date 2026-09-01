/*
  Warnings:

  - Added the required column `userId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exercise` ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `calorielog` RENAME INDEX `CalorieLog_userId_fkey` TO `CalorieLog_userId_idx`;

-- RenameIndex
ALTER TABLE `meal` RENAME INDEX `Meal_userId_fkey` TO `Meal_userId_idx`;

-- RenameIndex
ALTER TABLE `mealitem` RENAME INDEX `MealItem_foodId_fkey` TO `MealItem_foodId_idx`;

-- RenameIndex
ALTER TABLE `mealitem` RENAME INDEX `MealItem_mealId_fkey` TO `MealItem_mealId_idx`;

-- RenameIndex
ALTER TABLE `workout` RENAME INDEX `Workout_userId_fkey` TO `Workout_userId_idx`;

-- RenameIndex
ALTER TABLE `workoutexercise` RENAME INDEX `WorkoutExercise_exerciseId_fkey` TO `WorkoutExercise_exerciseId_idx`;

-- RenameIndex
ALTER TABLE `workoutexercise` RENAME INDEX `WorkoutExercise_workoutId_fkey` TO `WorkoutExercise_workoutId_idx`;

-- RenameIndex
ALTER TABLE `workoutschedule` RENAME INDEX `WorkoutSchedule_userId_fkey` TO `WorkoutSchedule_userId_idx`;

-- RenameIndex
ALTER TABLE `workoutschedule` RENAME INDEX `WorkoutSchedule_workoutId_fkey` TO `WorkoutSchedule_workoutId_idx`;

-- RenameIndex
ALTER TABLE `workoutsession` RENAME INDEX `WorkoutSession_userId_fkey` TO `WorkoutSession_userId_idx`;

-- RenameIndex
ALTER TABLE `workoutsession` RENAME INDEX `WorkoutSession_workoutId_fkey` TO `WorkoutSession_workoutId_idx`;

-- RenameIndex
ALTER TABLE `workoutsessionexercise` RENAME INDEX `WorkoutSessionExercise_workoutExerciseId_fkey` TO `WorkoutSessionExercise_workoutExerciseId_idx`;

-- RenameIndex
ALTER TABLE `workoutsessionexercise` RENAME INDEX `WorkoutSessionExercise_workoutSessionId_fkey` TO `WorkoutSessionExercise_workoutSessionId_idx`;

-- RenameIndex
ALTER TABLE `workoutsessionset` RENAME INDEX `WorkoutSessionSet_workoutSessionExerciseId_fkey` TO `WorkoutSessionSet_workoutSessionExerciseId_idx`;

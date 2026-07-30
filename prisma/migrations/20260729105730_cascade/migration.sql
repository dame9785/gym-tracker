-- DropForeignKey
ALTER TABLE `workoutsessionexercise` DROP FOREIGN KEY `WorkoutSessionExercise_workoutExerciseId_fkey`;

-- DropIndex
DROP INDEX `WorkoutSessionExercise_workoutExerciseId_fkey` ON `workoutsessionexercise`;

-- AddForeignKey
ALTER TABLE `WorkoutSessionExercise` ADD CONSTRAINT `WorkoutSessionExercise_workoutExerciseId_fkey` FOREIGN KEY (`workoutExerciseId`) REFERENCES `WorkoutExercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

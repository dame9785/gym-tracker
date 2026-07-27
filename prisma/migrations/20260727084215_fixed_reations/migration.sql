-- DropForeignKey
ALTER TABLE `workoutexercise` DROP FOREIGN KEY `WorkoutExercise_workoutId_fkey`;

-- DropForeignKey
ALTER TABLE `workoutschedule` DROP FOREIGN KEY `WorkoutSchedule_workoutId_fkey`;

-- DropForeignKey
ALTER TABLE `workoutsession` DROP FOREIGN KEY `WorkoutSession_workoutId_fkey`;

-- DropForeignKey
ALTER TABLE `workoutsessionexercise` DROP FOREIGN KEY `WorkoutSessionExercise_workoutSessionId_fkey`;

-- DropForeignKey
ALTER TABLE `workoutsessionset` DROP FOREIGN KEY `WorkoutSessionSet_workoutSessionExerciseId_fkey`;

-- DropIndex
DROP INDEX `WorkoutExercise_workoutId_fkey` ON `workoutexercise`;

-- DropIndex
DROP INDEX `WorkoutSchedule_workoutId_fkey` ON `workoutschedule`;

-- DropIndex
DROP INDEX `WorkoutSession_workoutId_fkey` ON `workoutsession`;

-- DropIndex
DROP INDEX `WorkoutSessionExercise_workoutSessionId_fkey` ON `workoutsessionexercise`;

-- DropIndex
DROP INDEX `WorkoutSessionSet_workoutSessionExerciseId_fkey` ON `workoutsessionset`;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSchedule` ADD CONSTRAINT `WorkoutSchedule_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSession` ADD CONSTRAINT `WorkoutSession_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSessionExercise` ADD CONSTRAINT `WorkoutSessionExercise_workoutSessionId_fkey` FOREIGN KEY (`workoutSessionId`) REFERENCES `WorkoutSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSessionSet` ADD CONSTRAINT `WorkoutSessionSet_workoutSessionExerciseId_fkey` FOREIGN KEY (`workoutSessionExerciseId`) REFERENCES `WorkoutSessionExercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

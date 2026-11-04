-- Add exercise archiving
ALTER TABLE `exercise`
ADD COLUMN `archivedAt` DATETIME(3) NULL;

-- Add index for active and archived exercises
CREATE INDEX `Exercise_userId_archivedAt_idx`
ON `exercise`(`userId`, `archivedAt`);

-- Change WorkoutSession -> Workout from CASCADE to RESTRICT
ALTER TABLE `workoutsession`
DROP FOREIGN KEY `WorkoutSession_workoutId_fkey`;

ALTER TABLE `workoutsession`
ADD CONSTRAINT `WorkoutSession_workoutId_fkey`
FOREIGN KEY (`workoutId`)
REFERENCES `workout`(`id`)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Change WorkoutSessionExercise -> WorkoutExercise from CASCADE to RESTRICT
ALTER TABLE `workoutsessionexercise`
DROP FOREIGN KEY `WorkoutSessionExercise_workoutExerciseId_fkey`;

ALTER TABLE `workoutsessionexercise`
ADD CONSTRAINT `WorkoutSessionExercise_workoutExerciseId_fkey`
FOREIGN KEY (`workoutExerciseId`)
REFERENCES `workoutexercise`(`id`)
ON DELETE RESTRICT
ON UPDATE CASCADE;
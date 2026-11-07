-- AlterTable
ALTER TABLE `workoutsession` ADD COLUMN `workoutScheduleId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `WorkoutSession_workoutScheduleId_idx` ON `WorkoutSession`(`workoutScheduleId`);

-- AddForeignKey
ALTER TABLE `WorkoutSession` ADD CONSTRAINT `WorkoutSession_workoutScheduleId_fkey` FOREIGN KEY (`workoutScheduleId`) REFERENCES `WorkoutSchedule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

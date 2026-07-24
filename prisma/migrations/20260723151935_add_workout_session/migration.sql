-- CreateTable
CREATE TABLE `WorkoutSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `workoutId` INTEGER NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finishedAt` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutSessionExercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutSessionId` INTEGER NOT NULL,
    `workoutExerciseId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutSessionSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutSessionExerciseId` INTEGER NOT NULL,
    `setNumber` INTEGER NOT NULL,
    `targetReps` INTEGER NOT NULL,
    `targetWeight` DOUBLE NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutSession` ADD CONSTRAINT `WorkoutSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSession` ADD CONSTRAINT `WorkoutSession_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSessionExercise` ADD CONSTRAINT `WorkoutSessionExercise_workoutSessionId_fkey` FOREIGN KEY (`workoutSessionId`) REFERENCES `WorkoutSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSessionExercise` ADD CONSTRAINT `WorkoutSessionExercise_workoutExerciseId_fkey` FOREIGN KEY (`workoutExerciseId`) REFERENCES `WorkoutExercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSessionSet` ADD CONSTRAINT `WorkoutSessionSet_workoutSessionExerciseId_fkey` FOREIGN KEY (`workoutSessionExerciseId`) REFERENCES `WorkoutSessionExercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

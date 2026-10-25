
-- 1. Add the new columns with temporary defaults
ALTER TABLE `exercise`
    ADD COLUMN `description` TEXT NOT NULL DEFAULT (''),
    ADD COLUMN `instructions` TEXT NOT NULL DEFAULT (''),
    ADD COLUMN `techniqueTips` TEXT NULL;

-- 2. Create the muscle group table
CREATE TABLE `MuscleGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MuscleGroup_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Create the exercise-muscle relation table
CREATE TABLE `ExerciseMuscle` (
    `exerciseId` INTEGER NOT NULL,
    `muscleGroupId` INTEGER NOT NULL,
    `role` ENUM('PRIMARY', 'SECONDARY') NOT NULL,

    INDEX `ExerciseMuscle_muscleGroupId_role_idx`(`muscleGroupId`, `role`),
    PRIMARY KEY (`exerciseId`, `muscleGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Copy existing muscle groups into the new table
INSERT INTO `MuscleGroup` (`name`)
SELECT DISTINCT `muscleGroup`
FROM `exercise`
WHERE `muscleGroup` IS NOT NULL
  AND TRIM(`muscleGroup`) <> '';

-- 5. Connect each existing exercise to its original muscle group
INSERT INTO `ExerciseMuscle` (`exerciseId`, `muscleGroupId`, `role`)
SELECT e.`id`, m.`id`, 'PRIMARY'
FROM `exercise` e
INNER JOIN `MuscleGroup` m
    ON m.`name` = e.`muscleGroup`
WHERE e.`muscleGroup` IS NOT NULL
  AND TRIM(e.`muscleGroup`) <> '';

-- 6. Remove the old column only after copying its data
ALTER TABLE `exercise`
    DROP COLUMN `muscleGroup`;

-- 7. Add foreign keys
ALTER TABLE `ExerciseMuscle`
    ADD CONSTRAINT `ExerciseMuscle_exerciseId_fkey`
    FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ExerciseMuscle`
    ADD CONSTRAINT `ExerciseMuscle_muscleGroupId_fkey`
    FOREIGN KEY (`muscleGroupId`) REFERENCES `MuscleGroup`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;


-- 1. Add the new columns as nullable
ALTER TABLE `exercise`
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `instructions` TEXT NULL,
    ADD COLUMN `techniqueTips` TEXT NULL;

-- 2. Populate existing exercises
UPDATE `exercise`
SET
    `description` = '',
    `instructions` = ''
WHERE `description` IS NULL
   OR `instructions` IS NULL;

-- 3. Make required columns NOT NULL
ALTER TABLE `exercise`
    MODIFY COLUMN `description` TEXT NOT NULL,
    MODIFY COLUMN `instructions` TEXT NOT NULL;

-- 4. Create the muscle group table
CREATE TABLE `MuscleGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `MuscleGroup_name_key` (`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. Create the exercise-muscle relation table
CREATE TABLE `ExerciseMuscle` (
    `exerciseId` INTEGER NOT NULL,
    `muscleGroupId` INTEGER NOT NULL,
    `role` ENUM('PRIMARY', 'SECONDARY') NOT NULL,
    INDEX `ExerciseMuscle_muscleGroupId_role_idx` (`muscleGroupId`, `role`),
    PRIMARY KEY (`exerciseId`, `muscleGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. Copy existing muscle groups
INSERT INTO `MuscleGroup` (`name`)
SELECT DISTINCT `muscleGroup`
FROM `exercise`
WHERE `muscleGroup` IS NOT NULL
  AND TRIM(`muscleGroup`) <> '';

-- 7. Link exercises to their original primary muscle
INSERT INTO `ExerciseMuscle` (`exerciseId`, `muscleGroupId`, `role`)
SELECT e.`id`, m.`id`, 'PRIMARY'
FROM `exercise` e
INNER JOIN `MuscleGroup` m
    ON m.`name` = e.`muscleGroup`
WHERE e.`muscleGroup` IS NOT NULL
  AND TRIM(e.`muscleGroup`) <> '';

-- 8. Remove the old column after copying its data
ALTER TABLE `exercise`
    DROP COLUMN `muscleGroup`;

-- 9. Add foreign keys
ALTER TABLE `ExerciseMuscle`
    ADD CONSTRAINT `ExerciseMuscle_exerciseId_fkey`
    FOREIGN KEY (`exerciseId`) REFERENCES `Exercise` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ExerciseMuscle`
    ADD CONSTRAINT `ExerciseMuscle_muscleGroupId_fkey`
    FOREIGN KEY (`muscleGroupId`) REFERENCES `MuscleGroup` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

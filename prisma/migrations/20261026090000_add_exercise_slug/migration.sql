ALTER TABLE `Exercise`
    ADD COLUMN `slug` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `exercise_slug_key` ON `Exercise`(`slug`);
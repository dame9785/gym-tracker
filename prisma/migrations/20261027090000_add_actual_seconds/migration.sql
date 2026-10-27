ALTER TABLE `workoutsessionset`
    ADD COLUMN `actualSeconds` INTEGER NULL,
    ADD COLUMN `targetSeconds` INTEGER NULL;

ALTER TABLE `exercise`
    RENAME INDEX `exercise_slug_key` TO `Exercise_slug_key`;
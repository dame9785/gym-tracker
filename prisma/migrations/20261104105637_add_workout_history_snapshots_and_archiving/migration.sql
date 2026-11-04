-- Backfill workout session snapshots.
UPDATE `workoutsession` AS ws
INNER JOIN `workout` AS w
    ON w.`id` = ws.`workoutId`
SET
    ws.`workoutName` = w.`name`,
    ws.`workoutDescription` = w.`description`;

-- Backfill exercise snapshots.
UPDATE `workoutsessionexercise` AS wse
INNER JOIN `workoutexercise` AS we
    ON we.`id` = wse.`workoutExerciseId`
INNER JOIN `exercise` AS e
    ON e.`id` = we.`exerciseId`
SET
    wse.`exerciseName` = e.`name`,
    wse.`exerciseImagePath` = e.`imagePath`,
    wse.`exerciseEquipment` = e.`equipment`,
    wse.`exerciseDescription` = e.`description`,
    wse.`exerciseInstructions` = e.`instructions`,
    wse.`exerciseTechniqueTips` = e.`techniqueTips`,
    wse.`primaryMuscle` = COALESCE(
        (
            SELECT mg.`name`
            FROM `exercisemuscle` AS em
            INNER JOIN `musclegroup` AS mg
                ON mg.`id` = em.`muscleGroupId`
            WHERE em.`exerciseId` = e.`id`
              AND em.`role` = 'PRIMARY'
            LIMIT 1
        ),
        ''
    ),
    wse.`secondaryMuscles` = COALESCE(
        (
            SELECT CAST(JSON_ARRAYAGG(mg.`name`) AS CHAR)
            FROM `exercisemuscle` AS em
            INNER JOIN `musclegroup` AS mg
                ON mg.`id` = em.`muscleGroupId`
            WHERE em.`exerciseId` = e.`id`
              AND em.`role` = 'SECONDARY'
        ),
        '[]'
    )
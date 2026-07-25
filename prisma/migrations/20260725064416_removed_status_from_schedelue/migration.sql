/*
  Warnings:

  - You are about to drop the column `status` on the `workoutschedule` table. All the data in the column will be lost.
  - The values [CANCELLED] on the enum `WorkoutSession_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `workoutschedule` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `workoutsession` MODIFY `status` ENUM('ACTIVE', 'COMPLETED', 'NOTCOMPLETED') NOT NULL DEFAULT 'ACTIVE';

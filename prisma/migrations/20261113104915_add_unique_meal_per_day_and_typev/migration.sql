-- Create unique index first
CREATE UNIQUE INDEX `Meal_userId_date_type_key`
ON `Meal`(`userId`, `date`, `type`);

-- Drop old index after the new index exists
DROP INDEX `Meal_userId_date_idx` ON `Meal`;
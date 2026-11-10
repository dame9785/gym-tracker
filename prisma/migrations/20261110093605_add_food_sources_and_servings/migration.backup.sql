/*
  Add food source information and serving sizes.
  Preserve existing MealItem data.
*/

-- AlterTable: Food
ALTER TABLE `food`
    ADD COLUMN `barcode` VARCHAR(64) NULL,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    ADD COLUMN `externalId` VARCHAR(191) NULL,
    ADD COLUMN `source` ENUM('LOCAL', 'OPEN_FOOD_FACTS', 'USDA') NOT NULL DEFAULT 'LOCAL';

-- AlterTable: MealItem
-- First add quantity as nullable to support existing records.
ALTER TABLE `mealitem`
    ADD COLUMN `quantity` DOUBLE NULL,
    ADD COLUMN `unit` ENUM('GRAM', 'MILLILITER', 'DECILITER', 'PIECE', 'PORTION') NOT NULL DEFAULT 'GRAM';

-- Copy existing grams into quantity.
UPDATE `mealitem`
SET `quantity` = `grams`
WHERE `quantity` IS NULL;

-- Make quantity required after migrating existing data.
ALTER TABLE `mealitem`
MODIFY `quantity` DOUBLE NOT NULL;

-- CreateTable: FoodServing
CREATE TABLE `FoodServing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `foodId` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `unit` ENUM('GRAM', 'MILLILITER', 'DECILITER', 'PIECE', 'PORTION') NOT NULL,
    `grams` DOUBLE NOT NULL,

    INDEX `FoodServing_foodId_idx`(`foodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Food_userId_name_idx` ON `food`(`userId`, `name`);

CREATE INDEX `Food_barcode_idx` ON `food`(`barcode`);

CREATE UNIQUE INDEX `Food_userId_source_externalId_key`
ON `food`(`userId`, `source`, `externalId`);

-- AddForeignKey
ALTER TABLE `FoodServing`
ADD CONSTRAINT `FoodServing_foodId_fkey`
FOREIGN KEY (`foodId`) REFERENCES `food`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;


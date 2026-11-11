-- AlterTable
ALTER TABLE `mealitem` ADD COLUMN `productId` INTEGER NULL,
    MODIFY `foodId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(64) NULL,
    `category` VARCHAR(100) NULL,
    `imageUrl` TEXT NULL,
    `caloriesPer100g` DOUBLE NOT NULL,
    `proteinPer100g` DOUBLE NOT NULL,
    `carbsPer100g` DOUBLE NOT NULL,
    `fatPer100g` DOUBLE NOT NULL,
    `sourceUrl` TEXT NULL,
    `verifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Product_barcode_key`(`barcode`),
    INDEX `Product_name_idx`(`name`),
    INDEX `Product_brand_idx`(`brand`),
    INDEX `Product_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `MealItem_productId_idx` ON `MealItem`(`productId`);

-- AddForeignKey
ALTER TABLE `MealItem` ADD CONSTRAINT `MealItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

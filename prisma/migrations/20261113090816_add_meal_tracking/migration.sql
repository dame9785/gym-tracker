-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(100) NULL,
    `barcode` VARCHAR(50) NULL,
    `category` VARCHAR(100) NULL,
    `imageUrl` TEXT NULL,
    `calories` DECIMAL(8, 2) NOT NULL,
    `protein` DECIMAL(8, 2) NOT NULL,
    `carbs` DECIMAL(8, 2) NOT NULL,
    `fat` DECIMAL(8, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Product_barcode_key`(`barcode`),
    INDEX `Product_name_idx`(`name`),
    INDEX `Product_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomFood` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(100) NULL,
    `calories` DECIMAL(8, 2) NOT NULL,
    `protein` DECIMAL(8, 2) NOT NULL,
    `carbs` DECIMAL(8, 2) NOT NULL,
    `fat` DECIMAL(8, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CustomFood_userId_name_idx`(`userId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Meal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(100) NULL,
    `type` ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER') NOT NULL,
    `date` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Meal_userId_date_idx`(`userId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MealItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mealId` INTEGER NOT NULL,
    `productId` INTEGER NULL,
    `customFoodId` INTEGER NULL,
    `quantity` DECIMAL(8, 2) NOT NULL,
    `nameSnapshot` VARCHAR(191) NOT NULL,
    `caloriesSnapshot` DECIMAL(10, 2) NOT NULL,
    `proteinSnapshot` DECIMAL(10, 2) NOT NULL,
    `carbsSnapshot` DECIMAL(10, 2) NOT NULL,
    `fatSnapshot` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MealItem_mealId_idx`(`mealId`),
    INDEX `MealItem_productId_idx`(`productId`),
    INDEX `MealItem_customFoodId_idx`(`customFoodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomFood` ADD CONSTRAINT `CustomFood_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Meal` ADD CONSTRAINT `Meal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealItem` ADD CONSTRAINT `MealItem_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealItem` ADD CONSTRAINT `MealItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealItem` ADD CONSTRAINT `MealItem_customFoodId_fkey` FOREIGN KEY (`customFoodId`) REFERENCES `CustomFood`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

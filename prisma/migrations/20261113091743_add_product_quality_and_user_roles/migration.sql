-- AlterTable
ALTER TABLE `product` ADD COLUMN `dataQuality` ENUM('VERIFIED', 'STANDARD', 'UNVERIFIED') NOT NULL DEFAULT 'UNVERIFIED',
    ADD COLUMN `nutritionSource` VARCHAR(255) NULL,
    ADD COLUMN `verifiedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX `Product_dataQuality_idx` ON `Product`(`dataQuality`);

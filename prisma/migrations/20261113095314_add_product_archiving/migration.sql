-- AlterTable
ALTER TABLE `product` ADD COLUMN `archivedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `Product_archivedAt_idx` ON `Product`(`archivedAt`);

/*
  Warnings:

  - You are about to drop the `calorielog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `food` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `foodserving` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mealitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `calorielog` DROP FOREIGN KEY `CalorieLog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `food` DROP FOREIGN KEY `Food_userId_fkey`;

-- DropForeignKey
ALTER TABLE `foodserving` DROP FOREIGN KEY `FoodServing_foodId_fkey`;

-- DropForeignKey
ALTER TABLE `meal` DROP FOREIGN KEY `Meal_userId_fkey`;

-- DropForeignKey
ALTER TABLE `mealitem` DROP FOREIGN KEY `MealItem_foodId_fkey`;

-- DropForeignKey
ALTER TABLE `mealitem` DROP FOREIGN KEY `MealItem_mealId_fkey`;

-- DropForeignKey
ALTER TABLE `mealitem` DROP FOREIGN KEY `MealItem_productId_fkey`;

-- DropTable
DROP TABLE `calorielog`;

-- DropTable
DROP TABLE `food`;

-- DropTable
DROP TABLE `foodserving`;

-- DropTable
DROP TABLE `meal`;

-- DropTable
DROP TABLE `mealitem`;

-- DropTable
DROP TABLE `product`;

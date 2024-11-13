/*
  Warnings:

  - Added the required column `base` to the `FavoriteCurrency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `favoritecurrency` ADD COLUMN `base` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `token` VARCHAR(191) NULL;

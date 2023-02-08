/*
  Warnings:

  - A unique constraint covering the columns `[neptun]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ALTER COLUMN `neptun` DROP DEFAULT,
    ALTER COLUMN `password` DROP DEFAULT;

-- CreateTable
CREATE TABLE `_subscribers` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_subscribers_AB_unique`(`A`, `B`),
    INDEX `_subscribers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_neptun_key` ON `User`(`neptun`);

-- AddForeignKey
ALTER TABLE `_subscribers` ADD CONSTRAINT `_subscribers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_subscribers` ADD CONSTRAINT `_subscribers_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

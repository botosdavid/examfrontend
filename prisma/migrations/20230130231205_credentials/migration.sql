-- AlterTable
ALTER TABLE `User` ADD COLUMN `neptun` VARCHAR(191) NOT NULL DEFAULT 'neptun',
    ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT 'secret';

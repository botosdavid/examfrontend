/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Exam` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Exam_name_key` ON `Exam`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Exam_code_key` ON `Exam`(`code`);

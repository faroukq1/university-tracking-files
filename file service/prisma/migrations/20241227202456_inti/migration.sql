/*
  Warnings:

  - You are about to drop the column `validationStatus` on the `filesubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `filesubmission` DROP COLUMN `validationStatus`,
    ADD COLUMN `ADMINISTRATION` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `EDUCATION` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `FINANCE` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

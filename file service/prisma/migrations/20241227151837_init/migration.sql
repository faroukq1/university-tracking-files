/*
  Warnings:

  - Added the required column `personId` to the `FileSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `filesubmission` ADD COLUMN `personId` INTEGER NOT NULL;

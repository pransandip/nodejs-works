/*
  Warnings:

  - A unique constraint covering the columns `[phonecode]` on the table `Countries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Countries_phonecode_key` ON `Countries`(`phonecode`);

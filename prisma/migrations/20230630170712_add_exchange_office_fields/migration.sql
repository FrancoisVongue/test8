/*
  Warnings:

  - Added the required column `country` to the `ExchangeOffice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ExchangeOffice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExchangeOffice" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

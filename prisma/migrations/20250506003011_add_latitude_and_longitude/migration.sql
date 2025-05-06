/*
  Warnings:

  - Added the required column `latitude` to the `Recipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Recipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;

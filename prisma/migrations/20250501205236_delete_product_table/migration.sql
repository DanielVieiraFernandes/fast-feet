/*
  Warnings:

  - You are about to drop the column `productId` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `issuerId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_productId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_issuerId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_productId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_userId_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "issuerId",
DROP COLUMN "productId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "recipient" TEXT NOT NULL;

-- DropTable
DROP TABLE "products";

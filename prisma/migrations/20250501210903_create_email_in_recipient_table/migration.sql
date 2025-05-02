/*
  Warnings:

  - You are about to drop the column `cpf` on the `Recipient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Recipient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Recipient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Recipient_cpf_key";

-- AlterTable
ALTER TABLE "Recipient" DROP COLUMN "cpf",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_email_key" ON "Recipient"("email");

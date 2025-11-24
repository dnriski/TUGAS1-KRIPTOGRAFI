/*
  Warnings:

  - The `title` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `description` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "title",
ADD COLUMN     "title" BYTEA,
DROP COLUMN "description",
ADD COLUMN     "description" BYTEA;

/*
  Warnings:

  - You are about to drop the column `learning_goals` on the `mentees` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `mentors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mentees" DROP COLUMN "learning_goals",
ADD COLUMN     "workplace" TEXT;

-- AlterTable
ALTER TABLE "mentors" DROP COLUMN "company",
ADD COLUMN     "current_role" TEXT,
ADD COLUMN     "workplace" TEXT;

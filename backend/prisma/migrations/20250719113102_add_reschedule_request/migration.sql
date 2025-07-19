/*
  Warnings:

  - You are about to drop the column `booking_id` on the `reschedule_requests` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `reschedule_requests` table. All the data in the column will be lost.
  - You are about to drop the column `mentor_id` on the `reschedule_requests` table. All the data in the column will be lost.
  - You are about to drop the column `original_end_datetime` on the `reschedule_requests` table. All the data in the column will be lost.
  - You are about to drop the column `original_start_datetime` on the `reschedule_requests` table. All the data in the column will be lost.
  - You are about to drop the column `proposed_end_datetime` on the `reschedule_requests` table. All the data in the column will be lost.
  - You are about to drop the column `proposed_start_datetime` on the `reschedule_requests` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `reschedule_requests` table. All the data in the column will be lost.
  - You are about to drop the column `requested_by` on the `reschedule_requests` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `reschedule_requests` table. All the data in the column will be lost.
  - The `status` column on the `reschedule_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `bookingId` to the `reschedule_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proposedEnd` to the `reschedule_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proposedStart` to the `reschedule_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proposerId` to the `reschedule_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `reschedule_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reschedule_requests" DROP CONSTRAINT "reschedule_requests_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "reschedule_requests" DROP CONSTRAINT "reschedule_requests_mentor_id_fkey";

-- AlterTable
ALTER TABLE "reschedule_requests" DROP COLUMN "booking_id",
DROP COLUMN "created_at",
DROP COLUMN "mentor_id",
DROP COLUMN "original_end_datetime",
DROP COLUMN "original_start_datetime",
DROP COLUMN "proposed_end_datetime",
DROP COLUMN "proposed_start_datetime",
DROP COLUMN "reason",
DROP COLUMN "requested_by",
DROP COLUMN "updated_at",
ADD COLUMN     "bookingId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "proposedEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "proposedStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "proposerId" TEXT NOT NULL,
ADD COLUMN     "responseAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "reschedule_requests" ADD CONSTRAINT "reschedule_requests_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_requests" ADD CONSTRAINT "reschedule_requests_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "reschedule_requests" DROP CONSTRAINT "reschedule_requests_bookingId_fkey";

-- AddForeignKey
ALTER TABLE "reschedule_requests" ADD CONSTRAINT "reschedule_requests_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

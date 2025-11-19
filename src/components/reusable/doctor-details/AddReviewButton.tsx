import { useState } from "react";
// shadcn components
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddReviewIcon from '@/assets/icons/pencil.png'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AddReviewForm from "./AddReviewForm";

export default function AddReviewDialog({doctorId}: { doctorId?: number }) {
  const [openDialog, setOpenDialog] = useState(false);
  
  const payments: { bookingId: number; status: string; doctorId: number, isReviewed: boolean }[] =
  JSON.parse(localStorage.getItem("payments") || "[]");

  // Find booking for this doctor
  const booking = payments.find((b) => b.doctorId === doctorId);
  console.log(booking);

  const getDisabledReason = () => {
    if (!booking) return "You need a completed booking to review";
    if (!booking.bookingId) return "Invalid booking";
    if (booking.isReviewed) return "You already reviewed this doctor";
    return null;
  };

  const isDisabled = !booking || !booking.bookingId || booking.isReviewed;
  const disabledReason = getDisabledReason();

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex">
            <DialogTrigger asChild disabled={isDisabled}>
              <button className={`${isDisabled ? 'opacity-50' : 'hover:text-primary-500 text-primary-700 hover:scale-103'} flex flex-col items-center transition`} disabled={isDisabled}>
                <div className="flex items-center gap-1">
                  <img src={AddReviewIcon} alt="Add Review Icon" className="h-5 w-5" />
                  <span>Add review</span>
                </div>
                {(!booking?.isReviewed && booking) && (
                  <span className="text-xs text-neutral-500 mt-1">Haven't shared your experience yet?</span>
                )}
              </button>
            </DialogTrigger>
          </div>
        </TooltipTrigger>
        {isDisabled && (
          <TooltipContent>
            <p>{disabledReason}</p>
          </TooltipContent>
        )}
      </Tooltip>
      <DialogContent>
        <AddReviewForm
          doctorId={doctorId!}
          booking={booking}
          onClose={() => setOpenDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

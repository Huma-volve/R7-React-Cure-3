import { useState, useEffect } from "react";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAddReview } from "@/hooks/doctor-details/reviews/useAddReviews";
import { useUpdateReview } from "@/hooks/doctor-details/reviews/useUpdateReview";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export interface ReviewFormProps {
  doctorId: number;
  booking: { bookingId: number; isReviewed: boolean } | undefined;
  existingReview?: {
    review_id: number;
    rating: number;
    comment: string;
  };
  onClose: () => void;
}

export default function ReviewForm({ doctorId, booking, existingReview, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [inputValue, setInputValue] = useState(existingReview?.comment || "");

  const patientId = useSelector((state: RootState) => state.auth.user?.patient?.patient_id);
  const { mutate: addReview, isPending: isAdding } = useAddReview();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setInputValue(existingReview.comment);
    }
  }, [existingReview]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!inputValue.trim()) {
      toast.error("Empty review. Please write something before submitting.");
      return;
    }
    if (rating === 0) {
      toast.error("No rating selected. Please select a rating before submitting.");
      return;
    }

    if (existingReview) {
      updateReview(
        {
          review_id: existingReview.review_id,
          booking_id: booking?.bookingId,
          patient_id: patientId,
          doctor_id: doctorId,
          rating,
          comment: inputValue,
        },
        {
          onSuccess: () => {
            toast.success("Review updated!");
            onClose();
            window.location.reload();
          },
          onError: () => toast.error("Failed to update review"),
        }
      );
    } else {
      // CREATE new review
      addReview(
        {
          doctor_id: doctorId,
          rating,
          comment: inputValue,
          booking_id: booking!.bookingId,
          patient_id: patientId,
        },
        {
          onSuccess: () => {
            toast.success("Review added successfully!");
            const payments = JSON.parse(localStorage.getItem("payments") || "[]");
            const updatedPayments = payments.map((p: any) =>
              p.bookingId === booking!.bookingId ? { ...p, isReviewed: true } : p
            );
            localStorage.setItem("payments", JSON.stringify(updatedPayments));
            onClose();
            window.location.reload();
          },
          onError: () => toast.error("Failed to submit. You already reviewed this doctor!"),
        }
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <label className="text-lg font-serif">Your rate</label>
          <Rating value={rating} onValueChange={setRating} className="text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <RatingButton key={i} />
            ))}
          </Rating>
        </div>
        <p className="text-3xl font-semibold font-serif">{rating} / 5</p>
      </div>

      <label className="text-lg font-serif mt-5">Your review</label>
      <Textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="outline-none h-40 text-start border-primary-600"
        placeholder="Write your review..."
      />

      <Button type="submit" variant="outline" className="text-primary-600 border-primary-600">
        {existingReview ? (isUpdating ? "Updating..." : "Update review") : (isAdding ? "Submitting..." : "Send review")}
      </Button>
    </form>
  );
}

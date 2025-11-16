import { useState } from "react";
// shadcn components
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAddReview } from "@/hooks/doctor-details/useAddReviews";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function AddReviewDialog({closeDialog}: { closeDialog: () => void }) {
  const [rating, setRating] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const { mutate: addReview, isPending } = useAddReview();
  const patientId = useSelector((state: RootState) => state.auth.user?.id);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!inputValue.trim()) {
      toast.error('Empty review', {
        icon: "👎",
        description: "Please write something before submitting.",
      })
      return;
    }
    
    if (rating === 0) {
      toast.error('No rating selected', {
        icon: "⭐",
        description: "Please select a rating before submitting.",
      })
      return;
    }
    
    addReview(
      {
        doctor_id: 9,
        rating,
        comment: inputValue,
        booking_id: 139,
        patient_id: patientId
      },
      {
        onSuccess: () => {
          toast.success('Review added successfully!!', {
            icon: "🥙",
            description: "Your review has been submitted.",
          })

          setInputValue("");
          setRating(0);
          closeDialog();
        },

        onError: (err) => {
          toast.error('Failed to add review', {
            icon: "⭐",
            description: err?.message || "Something went wrong. Please try again.",
          })
        },
      }
    );

    setInputValue("");
    closeDialog();
  }

  return (
    <main>
      <h1 className="text-xl font-serif">Your rate</h1>

      <div className="flex justify-between mt-3 items-center gap-3">
        <Rating value={rating} onValueChange={setRating} className="text-yellow-400">
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton key={index} />
          ))}
        </Rating>

        <div className="text-center">
          <p className="text-3xl font-semibold font-serif">{rating} / 5</p>
        </div>
      </div>

      <form method="POST" onSubmit={handleSubmit} className="flex flex-col gap-3 mt-8">
        <label htmlFor="rating-input" className="text-lg font-serif">
          Your review
        </label>
        <Textarea
          id="rating-input"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          className="outline-none h-40 text-start"
          placeholder="Write your review..."
        />
        <Button type="submit" variant='outline' className="text-[#145DB8] border-[#145DB8]">{isPending ? 'Submitting' : 'Send your review'}</Button>
      </form>
    </main>
  );
}

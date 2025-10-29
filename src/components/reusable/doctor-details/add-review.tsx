import { useState } from "react";
// redux stuff
import { useDispatch } from "react-redux";
import { addReview } from "@/redux/doctorsSlice";
// shadcn components
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AddReviewDialog({doctorId, closeDialog}: { doctorId: number, closeDialog: () => void}) {
  const [rating, setRating] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();

  const mockUser = {
    id: 1,
    name: "Abdallah",
    imgSrc: "/patients/patient2.png",
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!inputValue.trim()) return;
    document.body.focus()
    dispatch(
      addReview({
        doctorId,
        userId: mockUser.id,
        name: mockUser.name,
        imgSrc: mockUser.imgSrc,
        rating,
        text: inputValue,
      })
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
          required
        />
        <Button type="submit" variant='outline' className="text-[#145DB8] border-[#145DB8]">Send your review</Button>
      </form>
    </main>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { starColor } from "@/pages/DoctorDetails";
import { StarIcon, Trash2 } from "lucide-react";
import moment from "moment";
import { onCardHoverStyle } from "@/components/reusable/doctor-details/doctor-details-card";
import { useDeleteReview } from "@/hooks/doctor-details/reviews/useDeleteReview";
import { toast } from "sonner";
// import { useState } from "react";
// import ReviewForm from "./AddReviewForm";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export interface ReviewProps {
  patient_id: number
  id: number,
  rating: number
  comment: string
  created_at: string
  user: {
    name: string
    profile_photo: string | null
    id: number
  }
}

// interface Payment {
//   bookingId: number;
//   doctorId: number;
//   patientId: number;
//   patientName?: string;
//   isReviewed: boolean;
// }

// doctorId
export default function ReviewCard({currentReview}: {currentReview: ReviewProps, doctorId?: number}) {
    // const [isEditOpen, setIsEditOpen] = useState(false);
    
    const payments = JSON.parse(localStorage.getItem("payments") || "[]");
    const storedPatientName = payments.at(-1)?.patientName || null;

    const { mutate: deleteReview, isPending: isDeletePending } = useDeleteReview();

    // const booking = payments.find((b: Payment) => b.doctorId === doctorId);
    
    function handleDelete() {
        deleteReview(currentReview.id, {
            onSuccess: () => {
                const updated = payments.map((p: any) =>
                    p.patientName === storedPatientName ? { ...p, isReviewed: false } : p
                );
                
                localStorage.setItem("payments", JSON.stringify(updated));
                toast.success("Review deleted");

                window.location.reload();
            },
            onError: () => toast.error("Failed to delete review"),
        });
    }
    
    return <Card key={currentReview.id} className={`selection:bg-white selection:text-primary-800 group bg-background hover:bg-primary-600 p-4 h-full hover:scale-102 ${onCardHoverStyle}`}>
            <CardTitle className="flex items-center justify-between flex-wrap">
            <div className="flex items-center gap-2">
                <img
                    src={currentReview.user.profile_photo ?? '/patient.jpg'}
                    className="h-[62px] w-[62px] rounded-full object-cover"
                    alt={`Review of ${currentReview.user.name}`}
                />
                <div className="flex flex-col gap-1 group-hover:text-white ml-2">
                    <h3>{currentReview.user.name === storedPatientName ? 'You' : currentReview.user.name}</h3>
                    <p className="text-neutral-600 font-normal group-hover:text-white/60 text-sm">{moment(currentReview.created_at).startOf('day').fromNow()}</p>
                </div>
            </div>

            <div style={{color: starColor}} className={`bg-[#F9E000]/10 flex gap-1 items-center rounded-lg p-1.5`}>
                <StarIcon style={{color: starColor, fill: starColor}} /> {currentReview.rating}
            </div>
            </CardTitle>

            <CardContent className="w-full flex justify-between items-center -px-2 text-neutral-900 group-hover:text-white text-sm">
            <span>
                {currentReview.comment}
            </span>
            <span className="flex items-center gap-2">
                {
                    currentReview.user.name === storedPatientName && (
                        <>
                            {/* <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogTrigger asChild>
                                    <Button variant='outline' className="border-primary-700 text-primary-700" size="sm">
                                    <Pencil />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <ReviewForm
                                        doctorId={doctorId}
                                        booking={booking}
                                        existingReview={{
                                            review_id: currentReview.id,
                                            rating: currentReview.rating,
                                            comment: currentReview.comment
                                        }}
                                        onClose={() => setIsEditOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog> */}
                            <Button size="sm" onClick={handleDelete} variant="destructive">
                                {isDeletePending ? '...' : (<Trash2 />)}
                            </Button>
                        </>
                    )
                }
            </span>
            </CardContent>
        </Card>
}
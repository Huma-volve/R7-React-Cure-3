import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import type { DoctorProps } from "./doctor-details-card";

export default function AppointmentButton({day, month, timeSlot, doctor} : {day: string | null, month: Date, timeSlot: string | null, doctor: DoctorProps}) {
    const canBook = day !== null && timeSlot !== "" && month;
    const navigate = useNavigate()

    return (
        <Button onClick={() => navigate('/checkout', {
            state: { day, timeSlot, doctor: doctor}, 
        })} className="border-primary-600 text-primary-600 p-6 w-[123px] h-12" variant='outline' disabled={!canBook}>
            Book
        </Button>
    )
}
import { Button } from "@/components/ui/button"
import type { DoctorProps } from "@/redux/doctorsSlice";
import { useNavigate } from "react-router-dom";

export default function AppointmentButton({date, timeSlot, doctor} : {date: string | null, timeSlot: string, doctor: DoctorProps}) {
    const canBook = date !== null && timeSlot !== "";
    const navigate = useNavigate()

    return (
        <Button onClick={() => navigate('/checkout', {
            state: { selectedDate: date, timeSlot, doctor: doctor}, 
        })} className="border-primary-600 text-primary-600 p-6 w-[123px] h-12" variant='outline' disabled={!canBook}>
            Book
        </Button>
    )
}
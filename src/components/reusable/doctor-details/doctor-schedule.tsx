import { useGetAvailableSlots } from "@/hooks/useGetAvailableSlots";
import PageSkeleton from "../PageSkeleton";

interface DoctorScheduleProps {
  doctorId: number;
  selectedDay: string | null;
  onSelectTimeSlot: (time: string) => void;
  selectedTimeSlot: string;
}

export default function DoctorSchedule({
  doctorId,
  selectedDay,
  onSelectTimeSlot,
  selectedTimeSlot,
}: DoctorScheduleProps) {
  const { data: availability, isLoading, isError } = useGetAvailableSlots(doctorId);

  if (isLoading) return <PageSkeleton />;
  if (isError) return <p>Failed to load available slots.</p>;
  if (!availability) return <p>No slots found.</p>;

  // Convert object to array for easier use
  const days = Object.entries(availability);

  // If a date is selected, find its times
  const selectedDayData = selectedDay
    ? days.find(([date]) => date === selectedDay)
    : null;

  if (!selectedDay)
    return <p className="text-center text-muted-foreground py-4">Please select a date from the calendar.</p>;

  if (!selectedDayData)
    return <p className="text-center text-muted-foreground py-4">No available slots for this day.</p>;

  const [date, info]: [string, any] = selectedDayData;

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">
        {info.day_name} ({date})
      </h3>

      <div className="grid place-items-center mb-8 gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {info.times.map((time: string) => {
          const isSelected = selectedTimeSlot === time;
          return (
            <button
              key={time}
              onClick={() => {
                onSelectTimeSlot(time)
              }}
              className={`${isSelected ? 'bg-primary-600 text-white' : 'bg-neutral-50 hover:bg-primary-50'}
                cursor-pointer hover:bg-primary-400 hover:text-white transition-colors flex flex-col items-center justify-center p-4 rounded-xl
                text-center gap-1 min-w-20`
              }
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
